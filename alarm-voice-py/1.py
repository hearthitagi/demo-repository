from pydub import AudioSegment
from pydub.generators import Sine

def generate_alarm(base_freq, overlay_freq, duration, crossfade, loop_times=1):
    """生成带颤音效果的告警声并循环指定次数"""
    base_tone = Sine(base_freq).to_audio_segment(duration=duration)
    overlay_tone = Sine(overlay_freq).to_audio_segment(duration=duration)
    alarm = base_tone.append(overlay_tone, crossfade=crossfade)
    return alarm * loop_times  # 使用乘法实现音频循环

# 定义三种告警参数（单位：毫秒）
# 基础频率（base）
# 颤音频率（overlay）
# 单次持续时间（dur）
# 交叉淡入淡出时间（fade）
# 内置循环次数（loop）
ALARM_PROFILES = {
    "critical": {"base": 2000, "overlay": 0, "dur": 800, "fade": 0, "loop": 3},
    "severe": {"base": 1500, "overlay": 0, "dur": 1200, "fade": 0, "loop": 3},
    "normal": {"base": 1000, "overlay": 0, "dur": 1500, "fade": 0, "loop": 3}
}

# 批量生成并导出告警文件
for alarm_type, params in ALARM_PROFILES.items():
    alarm = generate_alarm(
        base_freq=params["base"],
        overlay_freq=params["overlay"],
        duration=params["dur"],
        crossfade=params["fade"],
        loop_times=params["loop"]
    )
    # 添加淡入淡出避免突变音效[6,7](@ref)
    processed = alarm.fade_in(200).fade_out(200)
    # 导出为WAV格式保证音质[1,4](@ref)
    processed.export(f"{alarm_type}_alert.wav", 
                    format="wav",
                    parameters=["-ac", "1"])  # 单声道节省空间