# 查询语句
## 基础查询类型

  #### Leaf Queries (叶子查询)

  # Term查询 - 精确匹配
  {
      "term": {
          "field.keyword": "exact_value"
      }
  }

  # Match查询 - 全文搜索
  {
      "match": {
          "field": "search text"
      }
  }
  或者
  {
	  "match":  {
		   "level2_type": {
				"query": "工信部",
				"minimum_should_match": "80%",
				}
			}
}
match_phrase查询 必须匹配到这个词组才可以（不分词的全文检索）
  match 查询支持的参数：

  - query: 搜索内容
  - operator: and 或 or
  - minimum_should_match: 最小匹配数量
  - analyzer: 分析器
  - boost: 权重提升

  match_phrase 查询支持的参数：

  - query: 搜索内容
  - slop: 允许的词语间隔
  - analyzer: 分析器
  - boost: 权重提升
  # Range查询 - 范围查询
  {
      "range": {
          "age": {
              "gte": 18,
              "lte": 65
          }
      }
  }

  Compound Queries (复合查询)

  # Bool查询 - 组合多个查询条件
  {
      "bool": {
          "must": [],     # 必须匹配
          "should": [],   # 应该匹配
          "must_not": [], # 必须不匹配
          "filter": []    # 过滤条件
      }
  }
  
### should用法：
should 查询是 Elasticsearch 中非常重要的概念，我来详细解释它的检索逻辑：

  should 查询的工作原理

  1. 基本行为

  {
      "bool": {
          "should": [
              {"match": {"title": "Elasticsearch"}},
              {"match": {"content": "搜索引擎"}},
              {"term": {"category.keyword": "技术"}}
          ]
      }
  }

  2. 评分机制

  - 满足任何一个 should 条件都会返回
  - 满足的条件越多，评分（_score）越高
  - 默认情况下，至少匹配一个条件

  3. minimum_should_match 参数

  {
      "bool": {
          "should": [
              {"match": {"title": "Elasticsearch"}},
              {"match": {"content": "搜索引擎"}},
              {"term": {"category.keyword": "技术"}}
          ],
          "minimum_should_match": 2  # 至少匹配2个条件
      }
  }

  不同的 minimum_should_match 设置

  默认行为（至少1个）

  # 匹配 title="Elasticsearch" OR content="搜索引擎" OR category="技术"
  # 只要满足一个条件就会返回，但满足越多条件排序越靠前

  精确控制

  # 示例1：至少匹配2个条件
  "minimum_should_match": 2

  # 示例2：百分比
  "minimum_should_match": "50%"

  # 示例3：条件数量相关
  "minimum_should_match": "2<50%"  # 当有2个以上条件时，至少匹配50%

  实际应用示例

  4. 搜索多字段

  # 在标题、摘要、标签中搜索"人工智能"
  {
      "bool": {
          "should": [
              {"match": {"title": "人工智能"}},
              {"match": {"summary": "人工智能"}},
              {"match": {"tags": "人工智能"}}
          ],
          "minimum_should_match": 1
      }
  }

  5. 同义词搜索

  # 搜索"感谢信"或"感谢信件"或"表扬信"
  {
      "bool": {
          "should": [
              {"term": {"doc_type": "感谢信"}},
              {"term": {"doc_type": "感谢信件"}},
              {"term": {"doc_type": "表扬信"}}
          ]
      }
  }

  6. 组合查询

  # 结合 must 和 should
  {
      "bool": {
          "must": [
              {"range": {"created_at": {"gte": "2024-01-01"}}}
          ],
          "should": [
              {"match": {"title": "Elasticsearch"}},
              {"match": {"content": "搜索引擎"}}
          ],
          "minimum_should_match": 1
      }
  }


# 构建方式对比

  方式1: 直接字典构建

  body = {
      "query": {
          "term": {"field": "value"}
      }
  }

  方式2: 使用Elasticsearch DSL库

  from elasticsearch_dsl import Search, Q

  s = Search(using=es, index="your_index")
  s = s.query(Q("term", field="value"))
  response = s.execute()

  方式3: 使用原生查询字符串

  response = es.search(
      index="your_index",
      body={"query": {"query_string": {"query": "field:value"}}}
  )

  8. 每种方式的使用场景

  字典构建方式

  - ✅ 优点：最直接，完全控制，适合复杂查询
  - ❌ 缺点：代码冗长，容易出错
  - 🎯 适用：生产环境，复杂查询逻辑

  DSL库方式

  - ✅ 优点：代码简洁，类型安全，链式调用
  - ❌ 缺点：需要额外安装依赖
  - 🎯 适用：开发环境，频繁查询操作

  查询字符串方式

  - ✅ 优点：最简洁，动态查询
  - ❌ 缺点：安全性风险，功能限制
  - 🎯 适用：用户输入，简单查询

  4. 实用查询示例

  复杂查询结构

  # 复合条件查询
  ```json
  body = {
      "query": {
          "bool": {
              "must": [
                  {"term": {"doc_type.keyword": "感谢信"}},
                  {"range": {"created_at": {"gte": "2024-01-01"}}}
              ],
              "filter": [
                  {"exists": {"field": "content"}}
              ]
          }
      },
      "size": 20,
      "sort": [{"created_at": {"order": "desc"}}]
  }

  ```
  全文搜索
  ```shell
  
  GET /political_news/_search

{"_source": [

"title", "summary", "source", "date", "area",

"importance_score", "government_relevance_score",

"level1_type", "level2_type", "timestamp",

"created_at", "updated_at", "crawl_date", "important_affairs"

], "from": 0, "size": 100, 
"query": {"bool": {

"must": [

{"term": {"level1_type.keyword": "中央"}}, #关键字严格匹配

{"match": { "level2_type": {

"query": "工信部",

"minimum_should_match": "80%"

}}},#分词器将query分成单字进行查询，并给一个分数，80%即必须有80%以上的单字出现在该字段。出现的越多该字段查询的得分就越高，查询结果越靠前。

{"range": {"government_relevance_score": {"gte": 0.8}}},

{"range": {"crawl_date": {"gte": "2025-12-17T16:24:31","lte": "now"}}},

{"term": {"important_affairs": true}} #如果这个字段大部分都是true，那么查到了true，这个字段得分也会比较低。boost字段可以使权重提升

]

}} }
  ```
  聚合查询

  # 分组统计
  body = {
      "size": 0,
      "aggs": {
          "group_by_type": {
              "terms": {
                  "field": "doc_type.keyword",
                  "size": 10
              }
          }
      }
  }

 5. 参考文档链接

  官方文档（推荐）：

  - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html
  - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-intro.html
  - https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html
  - https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html

  Python客户端文档：

  - https://elasticsearch-py.readthedocs.io/en/latest/
  - https://elasticsearch-dsl.readthedocs.io/en/latest/

  中文资源：

  - https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html
  - https://es.xiaoleilu.com/