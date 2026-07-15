

## CL-BENCH: A BENCHMARK FOR CONTEXT LEARNING

- Context Learning: Humans aren't relying solely on a fixed body of knowledge learned years ago.**We are learning, in real-time, from the context right in front of us.**
- Current LLMs rely on **information compressed into their weights** during pre-training. At inference time, they function largely by recalling these static information.
- Today's frontier LMs are still **far from reliable** context learners

- **CL-BENCH：**A dataset of deliberately constructed tasks, each of which is **complex**, **content-rich**, and **unseen during pre-training**.

![](https://apijoyspace.jd.com/v1/files/2ADdhaY0CQUQHudynIHV/link)

- **Contamination-free design**

- 1）Fictional creation；
- 2）Modification of existing content；
- 3）Incorporation of niche and emerging content

![](https://apijoyspace.jd.com/v1/files/2ojZIWG3ca8iCFebEA63/link)

- **Main Results**

![](https://apijoyspace.jd.com/v1/files/GCEL0tu3X289kq8kFiNr/link)

![](https://apijoyspace.jd.com/v1/files/4rUjTdAhas5vSccvJco3/link)

## DINO

- A similar phenomenon also exists in SOTA vision models. When confronted with **data (or distributions) unseen during training**, their performance drops significantly. This issue does not seem to disappear even as model size and pre-training data scale continue to grow.

|   |   |   |
|---|---|---|
||ImageNet-KNN|ImageNet-Linear|
|DINOv1|77.4|80.1|
|DINOv2|82.0|84.5|
|DINOv3|84.6|87.2|

|   |   |
|---|---|
||Linear-Prob|
|DINOv1|72.6(INat18)|
|DINOv2|73.9(ImageNet-A)|
|DINOv3|72.8(ObjectNet)|

## Augmentations vs Algorithms: What Works in Self-Supervised Learning

- **Bitter lesson** for SSL: that **augmentation diversity** and **data / model scale** are more critical contributors to recent advances in self-supervised learning.
- By bottlenecking information and reducing the mutual information between its input and output representations, the projector helps the SSL backbone retain more information.

![](https://apijoyspace.jd.com/v1/files/Sbnl8TUXx0thrgM7XkO0/link)

![](https://apijoyspace.jd.com/v1/files/QknWiy7g0BKLsLu6aiNQ/link)

## Generalization vs. Memorization

- Bigger models、 repeated strings 、long contenxt memoreize more
- Language models first use their capacity to memorize data; only when that capacity is no longer sufficient to keep encoding sample-specific details do they more clearly shift toward learning reusable patterns

![](https://apijoyspace.jd.com/v1/files/jANrHiPKIhFT6TLKuC6m/link)![](https://apijoyspace.jd.com/v1/files/i155nG9c8mXuF1yLj6iF/link)

A QUESTION TAKES HOME : when we scale up models, are we merely enabling them to memorize more data-specific features?