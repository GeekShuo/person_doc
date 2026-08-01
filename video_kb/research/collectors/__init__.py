"""各平台搜索适配器。

- ytdlp_search : bili / youtube 免登录搜索（yt-dlp 的 bilisearch:/ytsearch:）
- media_crawler: xhs / dy / zhihu / wb 等，走 MediaCrawler 子进程（需扫码登录一次）
- manual       : 手动 URL 清单（twitter/x 等无法稳定自动搜索的平台）
"""
