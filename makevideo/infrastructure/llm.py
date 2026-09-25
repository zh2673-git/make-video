# -*- coding: utf-8 -*-
"""[时空层级：数据存储（空间）] infrastructure/llm.py —— OpenAI 兼容 chat 客户端（纯 stdlib，零第三方依赖）

配置走环境变量（compose --ai 消费）：
  MAKEVIDEO_LLM_BASE_URL  缺省 https://api.openai.com/v1
  MAKEVIDEO_LLM_API_KEY   必填（缺失即 E7，提示 --prompt-out 离线替代）
  MAKEVIDEO_LLM_MODEL     必填（如 gpt-4o-mini / deepseek-chat 等任意兼容模型）
"""
import json
import os
import urllib.error
import urllib.request

from makevideo.core.errors import LLMError

_TIMEOUT = 180  # 长草稿生成给足余量


def chat(system: str, user: str, *, temperature: float = 0.4) -> str:
    """同步调用 /chat/completions，返回首个 choice 文本。配置缺失/HTTP 失败一律 E7。"""
    base_url = (os.environ.get("MAKEVIDEO_LLM_BASE_URL") or "https://api.openai.com/v1").rstrip("/")
    api_key = os.environ.get("MAKEVIDEO_LLM_API_KEY")
    model = os.environ.get("MAKEVIDEO_LLM_MODEL")
    if not api_key or not model:
        raise LLMError("未配置 LLM 接口：需设 MAKEVIDEO_LLM_API_KEY 与 MAKEVIDEO_LLM_MODEL"
                       "（可选 MAKEVIDEO_LLM_BASE_URL，OpenAI 兼容协议）；离线可用 --prompt-out 产出任务包")
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": temperature,
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{base_url}/chat/completions", data=payload, method="POST",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"})
    try:
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:300]
        raise LLMError(f"LLM 接口 HTTP {e.code}: {detail}")
    except urllib.error.URLError as e:
        raise LLMError(f"LLM 接口不可达: {e.reason}")
    try:
        return data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError) as e:
        raise LLMError(f"LLM 响应格式异常: {e.__class__.__name__}（raw keys={list(data) if isinstance(data, dict) else '?'}）")
