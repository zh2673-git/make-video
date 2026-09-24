# -*- coding: utf-8 -*-
"""[时空层级：数据规范（规则）] core/errors.py —— 错误码与工具异常

E1 工程配置缺失 | E2 DSL 校验失败 | E3 主题缺失/校验失败
E4 TTS 数量不一致 | E5 渲染非零退出 | E6 拼接失败
"""


class MakeVideoError(Exception):
    code = "E0"

    def __init__(self, message: str):
        super().__init__(f"[{self.code}] {message}")


class ProjectError(MakeVideoError):  # 工程配置/讲稿文件缺失
    code = "E1"


class SchemaError(MakeVideoError):  # 讲稿 DSL 校验失败
    code = "E2"


class ThemeError(MakeVideoError):  # 主题缺失或 token 校验失败
    code = "E3"


class TtsCountError(MakeVideoError):  # TTS 音频数与分镜数不一致
    code = "E4"


class RenderError(MakeVideoError):  # Remotion 渲染失败
    code = "E5"


class ConcatError(MakeVideoError):  # 分段拼接失败
    code = "E6"
