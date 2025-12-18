查询语句
1. 基础查询类型

  Leaf Queries (叶子查询)

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

  2. 构建方式对比

  方式1: 直接字典构建 (你当前使用)

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

  3. 每种方式的使用场景

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