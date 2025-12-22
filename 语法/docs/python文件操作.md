```python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

"""

Python文件操作代码示例

包含各种常见的文件处理场景和最佳实践

"""

  

import os

import json

import csv

import shutil

import glob

from pathlib import Path

from typing import List, Dict, Any

import logging

  

# 配置日志

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

logger = logging.getLogger(__name__)

  

# ==================== 基本文件读写操作 ====================

  

def read_file_basic(filepath: str, encoding: str = 'utf-8') -> str:

"""读取文件内容的基础方法"""

try:

with open(filepath, 'r', encoding=encoding) as file:

content = file.read()

return content

except FileNotFoundError:

logger.error(f"文件不存在: {filepath}")

return ""

except UnicodeDecodeError:

logger.error(f"编码错误，尝试其他编码: {filepath}")

# 尝试其他编码

for enc in ['gbk', 'gb2312', 'latin-1']:

try:

with open(filepath, 'r', encoding=enc) as file:

content = file.read()

logger.info(f"成功使用 {enc} 编码读取文件")

return content

except UnicodeDecodeError:

continue

return ""

  

def write_file_basic(filepath: str, content: str, encoding: str = 'utf-8') -> bool:

"""写入文件内容的基础方法"""

try:

# 确保目录存在

os.makedirs(os.path.dirname(filepath), exist_ok=True)

  

with open(filepath, 'w', encoding=encoding) as file:

file.write(content)

logger.info(f"成功写入文件: {filepath}")

return True

except Exception as e:

logger.error(f"写入文件失败: {filepath}, 错误: {e}")

return False

  

def append_to_file(filepath: str, content: str, encoding: str = 'utf-8') -> bool:

"""追加内容到文件"""

try:

with open(filepath, 'a', encoding=encoding) as file:

file.write(content + '\n')

logger.info(f"成功追加内容到文件: {filepath}")

return True

except Exception as e:

logger.error(f"追加内容失败: {filepath}, 错误: {e}")

return False

  

def read_file_line_by_line(filepath: str, encoding: str = 'utf-8') -> List[str]:

"""逐行读取文件"""

lines = []

try:

with open(filepath, 'r', encoding=encoding) as file:

for line in file:

lines.append(line.strip())

return lines

except Exception as e:

logger.error(f"读取文件失败: {filepath}, 错误: {e}")

return []

  

def process_large_file(filepath: str, output_filepath: str, process_func):

"""处理大文件，逐行处理以节省内存"""

try:

with open(filepath, 'r', encoding='utf-8') as infile, \

open(output_filepath, 'w', encoding='utf-8') as outfile:

  

for line_num, line in enumerate(infile, 1):

processed_line = process_func(line.strip(), line_num)

if processed_line:

outfile.write(processed_line + '\n')

  

# 每1000行打印一次进度

if line_num % 1000 == 0:

logger.info(f"已处理 {line_num} 行")

  

logger.info(f"大文件处理完成: {filepath} -> {output_filepath}")

  

except Exception as e:

logger.error(f"处理大文件失败: {e}")

  

# ==================== CSV文件操作 ====================

  

def read_csv_basic(filepath: str, encoding: str = 'utf-8') -> List[Dict[str, Any]]:

"""读取CSV文件基础方法"""

data = []

try:

with open(filepath, 'r', encoding=encoding, newline='') as csvfile:

reader = csv.DictReader(csvfile)

for row in reader:

data.append(row)

return data

except Exception as e:

logger.error(f"读取CSV文件失败: {filepath}, 错误: {e}")

return []

  

def write_csv_basic(filepath: str, data: List[Dict[str, Any]], fieldnames: List[str] = None):

"""写入CSV文件基础方法"""

try:

if not data:

logger.warning("没有数据可写入")

return False

  

if fieldnames is None:

fieldnames = list(data[0].keys())

  

# 确保目录存在

os.makedirs(os.path.dirname(filepath), exist_ok=True)

  

with open(filepath, 'w', encoding='utf-8', newline='') as csvfile:

writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

writer.writeheader()

writer.writerows(data)

  

logger.info(f"成功写入CSV文件: {filepath}, 共 {len(data)} 行")

return True

  

except Exception as e:

logger.error(f"写入CSV文件失败: {filepath}, 错误: {e}")

return False

  

def read_csv_chunked(filepath: str, chunk_size: int = 10000, encoding: str = 'utf-8'):

"""分块读取大CSV文件"""

try:

with open(filepath, 'r', encoding='utf-8', newline='') as csvfile:

reader = csv.DictReader(csvfile)

chunk = []

for i, row in enumerate(reader):

chunk.append(row)

if len(chunk) >= chunk_size:

yield chunk

chunk = []

  

if chunk: # 处理最后一块

yield chunk

  

except Exception as e:

logger.error(f"分块读取CSV失败: {filepath}, 错误: {e}")

  

def process_csv_with_pandas_style(filepath: str, output_filepath: str, filter_func=None):

"""类似pandas风格的CSV处理（不使用pandas）"""

try:

# 读取文件头

with open(filepath, 'r', encoding='utf-8') as csvfile:

reader = csv.reader(csvfile)

headers = next(reader)

  

processed_data = []

  

with open(filepath, 'r', encoding='utf-8') as csvfile:

reader = csv.DictReader(csvfile)

for row_num, row in enumerate(reader, 1):

# 应用过滤函数

if filter_func is None or filter_func(row):

processed_data.append(row)

  

if row_num % 10000 == 0:

logger.info(f"已处理 {row_num} 行")

  

# 写入结果

if processed_data:

write_csv_basic(output_filepath, processed_data, headers)

logger.info(f"CSV处理完成，输出: {output_filepath}")

else:

logger.warning("没有数据符合条件")

  

except Exception as e:

logger.error(f"CSV处理失败: {e}")

  

# ==================== JSON文件操作 ====================

  

def read_json_basic(filepath: str, encoding: str = 'utf-8') -> Any:

"""读取JSON文件"""

try:

with open(filepath, 'r', encoding=encoding) as jsonfile:

data = json.load(jsonfile)

return data

except FileNotFoundError:

logger.error(f"JSON文件不存在: {filepath}")

return None

except json.JSONDecodeError as e:

logger.error(f"JSON格式错误: {filepath}, 错误: {e}")

return None

except Exception as e:

logger.error(f"读取JSON文件失败: {filepath}, 错误: {e}")

return None

  

def write_json_basic(filepath: str, data: Any, indent: int = 2, ensure_ascii: bool = False):

"""写入JSON文件"""

try:

# 确保目录存在

os.makedirs(os.path.dirname(filepath), exist_ok=True)

  

with open(filepath, 'w', encoding='utf-8') as jsonfile:

json.dump(data, jsonfile, indent=indent, ensure_ascii=ensure_ascii)

  

logger.info(f"成功写入JSON文件: {filepath}")

return True

  

except Exception as e:

logger.error(f"写入JSON文件失败: {filepath}, 错误: {e}")

return False

  

def read_json_lines(filepath: str, encoding: str = 'utf-8') -> List[Dict[str, Any]]:

"""读取JSONL格式文件（每行一个JSON对象）"""

data = []

try:

with open(filepath, 'r', encoding=encoding) as jsonfile:

for line_num, line in enumerate(jsonfile, 1):

line = line.strip()

if line:

try:

json_obj = json.loads(line)

data.append(json_obj)

except json.JSONDecodeError as e:

logger.warning(f"第{line_num}行JSON格式错误: {e}")

continue

return data

except Exception as e:

logger.error(f"读取JSONL文件失败: {filepath}, 错误: {e}")

return []

  

def write_json_lines(filepath: str, data: List[Dict[str, Any]]):

"""写入JSONL格式文件"""

try:

os.makedirs(os.path.dirname(filepath), exist_ok=True)

  

with open(filepath, 'w', encoding='utf-8') as jsonfile:

for item in data:

jsonfile.write(json.dumps(item, ensure_ascii=False) + '\n')

  

logger.info(f"成功写入JSONL文件: {filepath}, 共 {len(data)} 行")

return True

  

except Exception as e:

logger.error(f"写入JSONL文件失败: {filepath}, 错误: {e}")

return False

  

# ==================== 文件系统操作 ====================

  

def list_files_in_directory(directory: str, pattern: str = "*") -> List[str]:

"""列出目录中的文件"""

try:

files = []

for filepath in glob.glob(os.path.join(directory, pattern)):

if os.path.isfile(filepath):

files.append(filepath)

return sorted(files)

except Exception as e:

logger.error(f"列出文件失败: {directory}, 错误: {e}")

return []

  

def create_directory_structure(base_path: str, structure: Dict[str, Any]):

"""创建目录结构"""

try:

for name, content in structure.items():

path = os.path.join(base_path, name)

if isinstance(content, dict):

# 创建子目录

os.makedirs(path, exist_ok=True)

create_directory_structure(path, content)

else:

# 创建文件

os.makedirs(os.path.dirname(path), exist_ok=True)

if content is not None:

write_file_basic(path, content)

else:

# 创建空文件

Path(path).touch()

  

logger.info(f"目录结构创建完成: {base_path}")

  

except Exception as e:

logger.error(f"创建目录结构失败: {e}")

  

def copy_file_with_backup(src: str, dst: str, backup_suffix: str = '.backup'):

"""带备份的文件复制"""

try:

# 如果目标文件存在，先备份

if os.path.exists(dst):

backup_path = dst + backup_suffix

shutil.copy2(dst, backup_path)

logger.info(f"已备份原文件: {backup_path}")

  

# 复制文件

shutil.copy2(src, dst)

logger.info(f"文件复制成功: {src} -> {dst}")

return True

  

except Exception as e:

logger.error(f"文件复制失败: {e}")

return False

  

def get_file_info(filepath: str) -> Dict[str, Any]:

"""获取文件信息"""

try:

stat = os.stat(filepath)

return {

'path': filepath,

'size': stat.st_size,

'size_mb': round(stat.st_size / (1024 * 1024), 2),

'created': stat.st_ctime,

'modified': stat.st_mtime,

'accessed': stat.st_atime,

'is_file': os.path.isfile(filepath),

'is_dir': os.path.isdir(filepath),

'exists': os.path.exists(filepath)

}

except Exception as e:

logger.error(f"获取文件信息失败: {filepath}, 错误: {e}")

return {}

  

def find_files_by_pattern(root_dir: str, pattern: str = "*.txt", recursive: bool = True) -> List[str]:

"""按模式查找文件"""

try:

if recursive:

pattern_path = os.path.join(root_dir, "**", pattern)

files = glob.glob(pattern_path, recursive=True)

else:

pattern_path = os.path.join(root_dir, pattern)

files = glob.glob(pattern_path)

  

# 只返回文件，不包括目录

return [f for f in files if os.path.isfile(f)]

  

except Exception as e:

logger.error(f"查找文件失败: {e}")

return []

  

# ==================== 示例使用函数 ====================

  

def demo_basic_file_operations():

"""演示基本文件操作"""

print("=== 基本文件操作演示 ===")

  

# 写入示例文件

test_content = "这是一个测试文件\n包含多行内容\n用于演示文件操作"

test_file = "test_files/basic_test.txt"

  

if write_file_basic(test_file, test_content):

print(f"✓ 成功创建测试文件: {test_file}")

  

# 读取文件

content = read_file_basic(test_file)

print(f"✓ 文件内容:\n{content}")

  

# 追加内容

append_to_file(test_file, "追加的新行")

  

# 逐行读取

lines = read_file_line_by_line(test_file)

print(f"✓ 文件共有 {len(lines)} 行")

  

def demo_csv_operations():

"""演示CSV操作"""

print("\n=== CSV文件操作演示 ===")

  

# 创建示例数据

sample_data = [

{"name": "张三", "age": 25, "city": "北京", "salary": 8000},

{"name": "李四", "age": 30, "city": "上海", "salary": 12000},

{"name": "王五", "age": 28, "city": "广州", "salary": 10000}

]

  

csv_file = "test_files/sample_data.csv"

  

# 写入CSV

if write_csv_basic(csv_file, sample_data):

print(f"✓ 成功创建CSV文件: {csv_file}")

  

# 读取CSV

data = read_csv_basic(csv_file)

print(f"✓ 读取到 {len(data)} 条记录")

for row in data:

print(f" - {row['name']}: {row['city']}, 薪资: {row['salary']}")

  

def demo_json_operations():

"""演示JSON操作"""

print("\n=== JSON文件操作演示 ===")

  

# 创建示例数据

sample_data = {

"公司": "示例公司",

"员工": [

{"姓名": "张三", "部门": "技术部", "技能": ["Python", "JavaScript"]},

{"姓名": "李四", "部门": "市场部", "技能": ["营销", "策划"]}

],

"成立时间": "2020-01-01"

}

  

json_file = "test_files/company_data.json"

  

# 写入JSON

if write_json_basic(json_file, sample_data):

print(f"✓ 成功创建JSON文件: {json_file}")

  

# 读取JSON

data = read_json_basic(json_file)

if data:

print(f"✓ 公司名称: {data['公司']}")

print(f"✓ 员工数量: {len(data['员工'])}")

  

def demo_file_system_operations():

"""演示文件系统操作"""

print("\n=== 文件系统操作演示 ===")

  

# 创建目录结构

structure = {

"projects": {

"project1": {

"src": {

"main.py": "# 主程序文件\nprint('Hello, World!')",

"utils.py": None # 空文件

},

"README.md": "# 项目1\n这是一个示例项目"

},

"project2": {

"data": {},

"results": {}

}

}

}

  

create_directory_structure("test_files", structure)

print("✓ 成功创建目录结构")

  

# 查找文件

python_files = find_files_by_pattern("test_files", "*.py", recursive=True)

print(f"✓ 找到 {len(python_files)} 个Python文件")

  

# 获取文件信息

if python_files:

file_info = get_file_info(python_files[0])

print(f"✓ 文件信息: {os.path.basename(python_files[0])}, 大小: {file_info['size']} 字节")

  

if __name__ == "__main__":

# 创建测试目录

os.makedirs("test_files", exist_ok=True)

  

# 运行所有演示

demo_basic_file_operations()

demo_csv_operations()

demo_json_operations()

demo_file_system_operations()

  

print("\n=== 所有演示完成 ===")

print("生成的文件位于 'test_files' 目录中")
```