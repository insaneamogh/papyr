"""Seed data: 10 iconic ML papers with implementation micro-tasks."""

PAPERS = [
    {
        "slug": "transformer",
        "title": "Attention Is All You Need",
        "year": 2017,
        "authors": "Vaswani et al.",
        "tags": ["NLP", "Transformer"],
        "description": "Introduces the Transformer architecture, relying entirely on self-attention mechanisms. Revolutionized sequence modeling by replacing recurrence with multi-head attention.",
        "original_url": "https://arxiv.org/abs/1706.03762",
        "tasks": [
            {
                "id": "t01",
                "title": "Positional Encoding",
                "description": "## Problem Description\n\nTransformers have no inherent notion of token order. Positional encodings inject sequence position information using sine and cosine functions of different frequencies.\n\n## Mathematical Formulation\n\n```\nPE(pos, 2i) = sin(pos / 10000^(2i/d_model))\nPE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))\n```\n\nwhere `pos` is the position and `i` is the dimension index.\n\n## Constraints\n- Use pure NumPy\n- Return shape: `(seq_len, d_model)`\n\n## Example\n```python\nresult = positional_encoding(seq_len=4, d_model=8)\n# result.shape == (4, 8)\n```",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef positional_encoding(seq_len: int, d_model: int) -> np.ndarray:\n    \"\"\"\n    Generate positional encoding matrix.\n    Returns array of shape (seq_len, d_model).\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\nimport pytest\n\ndef test_shape():\n    result = submission.positional_encoding(4, 8)\n    assert result.shape == (4, 8)\n\ndef test_values():\n    result = submission.positional_encoding(1, 4)\n    expected_0 = np.sin(0)\n    assert abs(result[0, 0] - expected_0) < 1e-6\n\ndef test_alternating():\n    result = submission.positional_encoding(2, 4)\n    assert result[0, 0] == np.sin(0)\n    assert result[0, 1] == np.cos(0)\n",
                "solution_code": "import numpy as np\n\ndef positional_encoding(seq_len: int, d_model: int) -> np.ndarray:\n    pe = np.zeros((seq_len, d_model))\n    position = np.arange(0, seq_len).reshape(-1, 1)\n    div_term = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))\n    pe[:, 0::2] = np.sin(position * div_term)\n    pe[:, 1::2] = np.cos(position * div_term)\n    return pe\n",
                "time_limit": 2
            },
            {
                "id": "t02",
                "title": "Scaled Dot-Product Attention",
                "description": "## Problem Description\n\nThe core attention mechanism computes a weighted sum of values based on the similarity between queries and keys.\n\n## Mathematical Formulation\n\n```\nAttention(Q, K, V) = softmax(Q @ K^T / sqrt(d_k)) @ V\n```\n\n## Constraints\n- Use pure NumPy\n- Implement stable softmax\n\n## Example\n```python\nQ = np.ones((2, 3))\nK = np.ones((2, 3))\nV = np.ones((2, 3))\nresult = scaled_dot_product_attention(Q, K, V)\n# result.shape == (2, 3)\n```",
                "difficulty": "Medium",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef scaled_dot_product_attention(Q: np.ndarray, K: np.ndarray, V: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Compute scaled dot-product attention.\n    Q, K, V: (seq_len, d_k)\n    Returns: (seq_len, d_k)\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\nimport pytest\n\ndef test_shape():\n    Q = np.ones((2, 4))\n    K = np.ones((2, 4))\n    V = np.ones((2, 4))\n    result = submission.scaled_dot_product_attention(Q, K, V)\n    assert result.shape == (2, 4)\n\ndef test_uniform():\n    Q = np.ones((2, 4))\n    K = np.ones((2, 4))\n    V = np.eye(2, 4)\n    result = submission.scaled_dot_product_attention(Q, K, V)\n    assert np.allclose(result[0], result[1], atol=1e-5)\n",
                "solution_code": "import numpy as np\n\ndef scaled_dot_product_attention(Q, K, V):\n    d_k = Q.shape[-1]\n    scores = Q @ K.T / np.sqrt(d_k)\n    scores -= np.max(scores, axis=-1, keepdims=True)\n    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)\n    return weights @ V\n",
                "time_limit": 2
            },
            {
                "id": "t03",
                "title": "Multi-Head Attention",
                "description": "## Problem Description\n\nMulti-head attention runs several attention functions in parallel, allowing the model to attend to information from different representation subspaces.\n\n## Mathematical Formulation\n\n```\nMultiHead(Q, K, V) = Concat(head_1, ..., head_h) @ W_O\nwhere head_i = Attention(Q @ W_Q_i, K @ W_K_i, V @ W_V_i)\n```\n\n## Constraints\n- Use pure NumPy\n- Split d_model into `n_heads` equal parts",
                "difficulty": "Hard",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef multi_head_attention(Q: np.ndarray, K: np.ndarray, V: np.ndarray, W_Q: np.ndarray, W_K: np.ndarray, W_V: np.ndarray, W_O: np.ndarray, n_heads: int) -> np.ndarray:\n    \"\"\"\n    Compute multi-head attention.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_output_shape():\n    d = 8; h = 2; s = 3\n    Q = np.random.randn(s, d)\n    K = np.random.randn(s, d)\n    V = np.random.randn(s, d)\n    W_Q = np.random.randn(d, d)\n    W_K = np.random.randn(d, d)\n    W_V = np.random.randn(d, d)\n    W_O = np.random.randn(d, d)\n    result = submission.multi_head_attention(Q, K, V, W_Q, W_K, W_V, W_O, h)\n    assert result.shape == (s, d)\n",
                "solution_code": "",
                "time_limit": 3
            }
        ]
    },
    {
        "slug": "lora",
        "title": "LoRA: Low-Rank Adaptation of Large Language Models",
        "year": 2021,
        "authors": "Hu et al.",
        "tags": ["NLP", "Fine-tuning", "Low-Rank", "Parameter Efficiency"],
        "description": "Efficient fine-tuning of large models using low-rank decomposition of weight updates. Freezes pretrained weights and injects trainable rank decomposition matrices.",
        "original_url": "https://arxiv.org/abs/2106.09685",
        "tasks": [
            {
                "id": "l01",
                "title": "Low-Rank Initialization",
                "description": "## Problem Description\n\nInitialize LoRA adapter matrices A and B with deterministic pattern. Matrix A uses Kaiming uniform initialization and B is initialized to zeros.\n\n## Constraints\n- Use pure NumPy\n- A: shape (in_dim, rank), initialized with Kaiming uniform\n- B: shape (rank, out_dim), initialized to zeros",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef lora_init(in_dim: int, out_dim: int, rank: int) -> tuple:\n    \"\"\"\n    Initialize LoRA matrices A and B.\n    Returns: (A, B) tuple of numpy arrays\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_shapes():\n    A, B = submission.lora_init(8, 8, 2)\n    assert A.shape == (8, 2)\n    assert B.shape == (2, 8)\n\ndef test_b_zeros():\n    A, B = submission.lora_init(4, 4, 2)\n    assert np.allclose(B, 0)\n",
                "solution_code": "",
                "time_limit": 2
            },
            {
                "id": "l02",
                "title": "Low-Rank Forward Pass",
                "description": "## Problem Description\n\nCompute LoRA forward pass: Delta = A @ (B @ X), adding the low-rank adaptation to the frozen weight output.\n\n## Mathematical Formulation\n```\noutput = W @ x + (A @ B) @ x\n```",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef lora_forward(x: np.ndarray, W: np.ndarray, A: np.ndarray, B: np.ndarray, alpha: float = 1.0) -> np.ndarray:\n    \"\"\"\n    Compute LoRA forward pass.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_output_shape():\n    x = np.ones((3, 4))\n    W = np.ones((4, 4))\n    A = np.ones((4, 2))\n    B = np.ones((2, 4))\n    result = submission.lora_forward(x, W, A, B)\n    assert result.shape == (3, 4)\n\ndef test_zero_b():\n    x = np.ones((2, 4))\n    W = np.eye(4)\n    A = np.ones((4, 2))\n    B = np.zeros((2, 4))\n    result = submission.lora_forward(x, W, A, B)\n    assert np.allclose(result, x)\n",
                "solution_code": "",
                "time_limit": 2
            },
            {
                "id": "l03",
                "title": "Effective Rank",
                "description": "## Problem Description\n\nCompute the effective rank contribution as the ratio of the trace of (A @ B) to its Frobenius norm.\n\n## Mathematical Formulation\n```\neffective_rank = trace(A @ B) / ||A @ B||_F\n```\n\n## Constraints\n- Use pure NumPy\n- Handle edge cases where the norm might be zero",
                "difficulty": "Medium",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef effective_rank(A: np.ndarray, B: np.ndarray) -> float:\n    \"\"\"\n    Returns float scalar representing effective rank contribution.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_basic():\n    A = np.ones((4, 2), dtype=np.float32)\n    B = np.ones((2, 3), dtype=np.float32)\n    result = submission.effective_rank(A, B)\n    assert isinstance(result, float)\n\ndef test_zero():\n    A = np.zeros((4, 2))\n    B = np.zeros((2, 3))\n    result = submission.effective_rank(A, B)\n    assert result == 0.0\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "alexnet",
        "title": "ImageNet Classification with Deep Convolutional Neural Networks",
        "year": 2012,
        "authors": "Alex Krizhevsky, Ilya Sutskever et al.",
        "tags": ["CV", "CNN"],
        "description": "The AlexNet paper that revolutionized computer vision with deep CNNs. Implementing core CNN components from scratch: convolution, ReLU, max pooling.",
        "original_url": "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks",
        "tasks": [
            {
                "id": "a01",
                "title": "2D Convolution",
                "description": "## Problem Description\n\nImplement a basic 2D convolution operation (no padding, stride=1).\n\n## Constraints\n- Use pure NumPy\n- Input: (H, W), Kernel: (kH, kW)\n- Output: (H - kH + 1, W - kW + 1)",
                "difficulty": "Medium",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef conv2d(image: np.ndarray, kernel: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Perform 2D convolution.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_identity():\n    img = np.ones((5, 5))\n    kernel = np.array([[1.0]])\n    result = submission.conv2d(img, kernel)\n    assert result.shape == (5, 5)\n    assert np.allclose(result, 1.0)\n\ndef test_shape():\n    img = np.ones((6, 6))\n    kernel = np.ones((3, 3))\n    result = submission.conv2d(img, kernel)\n    assert result.shape == (4, 4)\n",
                "solution_code": "",
                "time_limit": 3
            },
            {
                "id": "a02",
                "title": "ReLU Activation",
                "description": "## Problem Description\n\nImplement the Rectified Linear Unit activation: f(x) = max(0, x)\n\n## Constraints\n- Use pure NumPy\n- Must work element-wise on any array shape",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef relu(x: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Apply ReLU activation.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_positive():\n    x = np.array([1.0, 2.0, 3.0])\n    assert np.allclose(submission.relu(x), x)\n\ndef test_negative():\n    x = np.array([-1.0, -2.0, -3.0])\n    assert np.allclose(submission.relu(x), 0)\n\ndef test_mixed():\n    x = np.array([-1, 0, 1])\n    assert np.allclose(submission.relu(x), [0, 0, 1])\n",
                "solution_code": "",
                "time_limit": 2
            },
            {
                "id": "a03",
                "title": "Max Pooling",
                "description": "## Problem Description\n\nImplement 2D max pooling with a given pool size and stride.\n\n## Constraints\n- Use pure NumPy\n- pool_size and stride are integers",
                "difficulty": "Medium",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef max_pool2d(x: np.ndarray, pool_size: int = 2, stride: int = 2) -> np.ndarray:\n    \"\"\"\n    Apply 2D max pooling.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_basic():\n    x = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]], dtype=float)\n    result = submission.max_pool2d(x, 2, 2)\n    assert result.shape == (2, 2)\n    assert result[0, 0] == 6\n    assert result[1, 1] == 16\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "vae",
        "title": "Auto-Encoding Variational Bayes",
        "year": 2013,
        "authors": "Diederik P Kingma, Max Welling",
        "tags": ["CV", "VAE"],
        "description": "Introduces the Variational Autoencoder (VAE), a deep generative model that learns a latent variable space using the reparameterization trick.",
        "original_url": "https://arxiv.org/abs/1312.6114",
        "tasks": [
            {
                "id": "v01",
                "title": "Reparameterization Trick",
                "description": "## Problem Description\n\nSample from a Gaussian distribution using the reparameterization trick: z = mu + sigma * epsilon.\n\n## Constraints\n- Use pure NumPy\n- epsilon ~ N(0, 1)",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef reparameterize(mu: np.ndarray, log_var: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Sample using reparameterization trick.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_shape():\n    mu = np.zeros((2, 4))\n    log_var = np.zeros((2, 4))\n    result = submission.reparameterize(mu, log_var)\n    assert result.shape == (2, 4)\n\ndef test_zero_variance():\n    mu = np.ones((2, 4)) * 5\n    log_var = np.full((2, 4), -100)\n    result = submission.reparameterize(mu, log_var)\n    assert np.allclose(result, 5.0, atol=0.01)\n",
                "solution_code": "",
                "time_limit": 2
            },
            {
                "id": "v02",
                "title": "KL Divergence",
                "description": "## Problem Description\n\nCompute the KL divergence between the learned distribution and a standard Gaussian.\n\n## Mathematical Formulation\n```\nKL = -0.5 * sum(1 + log_var - mu^2 - exp(log_var))\n```",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef kl_divergence(mu: np.ndarray, log_var: np.ndarray) -> float:\n    \"\"\"\n    Compute KL divergence.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_standard_normal():\n    mu = np.zeros((2, 4))\n    log_var = np.zeros((2, 4))\n    result = submission.kl_divergence(mu, log_var)\n    assert abs(result) < 1e-6\n\ndef test_positive():\n    mu = np.ones((2, 4))\n    log_var = np.ones((2, 4))\n    result = submission.kl_divergence(mu, log_var)\n    assert result > 0\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "bert",
        "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
        "year": 2018,
        "authors": "Devlin et al.",
        "tags": ["NLP", "Transformer", "Pre-training"],
        "description": "BERT learns deep bidirectional representations by pre-training on masked language modeling and next sentence prediction tasks.",
        "original_url": "https://arxiv.org/abs/1810.04805",
        "tasks": [
            {
                "id": "b01",
                "title": "Token Masking",
                "description": "## Problem Description\n\nImplement BERT's token masking strategy: randomly mask 15% of tokens, where 80% become [MASK], 10% become random tokens, 10% stay unchanged.\n\n## Constraints\n- Use pure NumPy with a fixed seed for reproducibility\n- Input: list of token ids, vocab_size",
                "difficulty": "Medium",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef mask_tokens(token_ids: np.ndarray, vocab_size: int, mask_token_id: int = 0, seed: int = 42) -> tuple:\n    \"\"\"\n    Apply BERT-style masking. Returns (masked_ids, mask_positions).\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_output_types():\n    tokens = np.arange(1, 21)\n    masked, positions = submission.mask_tokens(tokens, 100, 0, 42)\n    assert isinstance(masked, np.ndarray)\n    assert isinstance(positions, (list, np.ndarray))\n\ndef test_length_preserved():\n    tokens = np.arange(1, 101)\n    masked, positions = submission.mask_tokens(tokens, 100, 0, 42)\n    assert len(masked) == len(tokens)\n",
                "solution_code": "",
                "time_limit": 2
            },
            {
                "id": "b02",
                "title": "Segment Embeddings",
                "description": "## Problem Description\n\nCreate segment embeddings: assign 0 to tokens from sentence A and 1 to tokens from sentence B (separated by [SEP]).\n\n## Constraints\n- Use pure NumPy",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef segment_embeddings(token_ids: np.ndarray, sep_token_id: int) -> np.ndarray:\n    \"\"\"\n    Create segment embeddings (0 for sentence A, 1 for sentence B).\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_basic():\n    tokens = np.array([1, 2, 3, 99, 4, 5, 99])\n    result = submission.segment_embeddings(tokens, 99)\n    expected = np.array([0, 0, 0, 0, 1, 1, 1])\n    assert np.array_equal(result, expected)\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "rnn",
        "title": "Recurrent Neural Networks",
        "year": 1980,
        "authors": "Various",
        "tags": ["NLP", "RNN"],
        "description": "Implementing core RNN components from scratch: RNN cells, forward/backward passes, BPTT, initialization, padding utilities, gradient clipping.",
        "original_url": "",
        "tasks": [
            {
                "id": "r01",
                "title": "RNN Cell Forward",
                "description": "## Problem Description\n\nImplement a single RNN cell forward step: h_t = tanh(W_hh @ h_{t-1} + W_xh @ x_t + b)\n\n## Constraints\n- Use pure NumPy",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef rnn_cell_forward(x_t: np.ndarray, h_prev: np.ndarray, W_xh: np.ndarray, W_hh: np.ndarray, b: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Single RNN cell forward step.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_shape():\n    x = np.ones((1, 4))\n    h = np.zeros((1, 3))\n    W_xh = np.ones((4, 3))\n    W_hh = np.ones((3, 3))\n    b = np.zeros((1, 3))\n    result = submission.rnn_cell_forward(x, h, W_xh, W_hh, b)\n    assert result.shape == (1, 3)\n\ndef test_tanh_bounds():\n    x = np.ones((1, 4)) * 100\n    h = np.zeros((1, 3))\n    W_xh = np.ones((4, 3))\n    W_hh = np.ones((3, 3))\n    b = np.zeros((1, 3))\n    result = submission.rnn_cell_forward(x, h, W_xh, W_hh, b)\n    assert np.all(np.abs(result) <= 1.0)\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "gan",
        "title": "Generative Adversarial Networks",
        "year": 2014,
        "authors": "Ian Goodfellow et al.",
        "tags": ["GAN", "CV"],
        "description": "Introduces the GAN framework: a generator network learns to create realistic data to fool a discriminator network in a minimax game.",
        "original_url": "https://arxiv.org/abs/1406.2661",
        "tasks": [
            {
                "id": "g01",
                "title": "Binary Cross-Entropy Loss",
                "description": "## Problem Description\n\nImplement binary cross-entropy loss for GAN training.\n\n## Formula\n```\nBCE = -[y * log(p) + (1-y) * log(1-p)]\n```\n\n## Constraints\n- Use pure NumPy\n- Add epsilon for numerical stability",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef bce_loss(y_true: np.ndarray, y_pred: np.ndarray, eps: float = 1e-7) -> float:\n    \"\"\"\n    Compute binary cross-entropy loss.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_perfect_prediction():\n    y = np.array([1.0, 0.0])\n    p = np.array([0.999, 0.001])\n    result = submission.bce_loss(y, p)\n    assert result < 0.01\n\ndef test_worst_prediction():\n    y = np.array([1.0])\n    p = np.array([0.001])\n    result = submission.bce_loss(y, p)\n    assert result > 5.0\n",
                "solution_code": "",
                "time_limit": 2
            },
            {
                "id": "g02",
                "title": "Sigmoid Activation",
                "description": "## Problem Description\n\nImplement the sigmoid activation: sigma(x) = 1 / (1 + exp(-x))\n\n## Constraints\n- Use pure NumPy\n- Handle numerical stability for large values",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef sigmoid(x: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Apply sigmoid activation.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_zero():\n    assert abs(submission.sigmoid(np.array([0.0]))[0] - 0.5) < 1e-6\n\ndef test_large():\n    result = submission.sigmoid(np.array([100.0]))\n    assert abs(result[0] - 1.0) < 1e-4\n\ndef test_negative():\n    result = submission.sigmoid(np.array([-100.0]))\n    assert abs(result[0]) < 1e-4\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "resnet",
        "title": "Deep Residual Learning for Image Recognition",
        "year": 2015,
        "authors": "He et al.",
        "tags": ["CV", "CNN"],
        "description": "Introduces residual connections (skip connections) enabling training of very deep networks by learning residual mappings.",
        "original_url": "https://arxiv.org/abs/1512.03385",
        "tasks": [
            {
                "id": "res01",
                "title": "Residual Connection",
                "description": "## Problem Description\n\nImplement a residual/skip connection: output = F(x) + x\n\n## Constraints\n- Use pure NumPy\n- F is a simple linear transform: F(x) = W @ x + b",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef residual_block(x: np.ndarray, W: np.ndarray, b: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Apply residual connection: F(x) + x.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_identity():\n    x = np.ones((1, 4))\n    W = np.zeros((4, 4))\n    b = np.zeros(4)\n    result = submission.residual_block(x, W, b)\n    assert np.allclose(result, x)\n\ndef test_additive():\n    x = np.ones((1, 4))\n    W = np.eye(4)\n    b = np.zeros(4)\n    result = submission.residual_block(x, W, b)\n    assert np.allclose(result, 2 * x)\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "word2vec",
        "title": "Efficient Estimation of Word Representations in Vector Space",
        "year": 2013,
        "authors": "Mikolov et al.",
        "tags": ["NLP", "Embeddings"],
        "description": "Proposes Word2Vec: efficient methods for learning high-quality word vectors from large text corpora using Skip-gram and CBOW architectures.",
        "original_url": "https://arxiv.org/abs/1301.3781",
        "tasks": [
            {
                "id": "w01",
                "title": "Softmax Function",
                "description": "## Problem Description\n\nImplement numerically stable softmax.\n\n## Formula\n```\nsoftmax(x_i) = exp(x_i - max(x)) / sum(exp(x_j - max(x)))\n```",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef softmax(x: np.ndarray) -> np.ndarray:\n    \"\"\"\n    Compute stable softmax.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_sums_to_one():\n    x = np.array([1.0, 2.0, 3.0])\n    result = submission.softmax(x)\n    assert abs(np.sum(result) - 1.0) < 1e-6\n\ndef test_positive():\n    x = np.array([-1.0, 0.0, 1.0])\n    result = submission.softmax(x)\n    assert np.all(result > 0)\n\ndef test_large_values():\n    x = np.array([1000.0, 1001.0, 1002.0])\n    result = submission.softmax(x)\n    assert abs(np.sum(result) - 1.0) < 1e-6\n",
                "solution_code": "",
                "time_limit": 2
            },
            {
                "id": "w02",
                "title": "Cosine Similarity",
                "description": "## Problem Description\n\nCompute cosine similarity between two word vectors.\n\n## Formula\n```\ncos(a, b) = (a · b) / (||a|| * ||b||)\n```",
                "difficulty": "Easy",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:\n    \"\"\"\n    Compute cosine similarity.\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_identical():\n    a = np.array([1.0, 2.0, 3.0])\n    assert abs(submission.cosine_similarity(a, a) - 1.0) < 1e-6\n\ndef test_orthogonal():\n    a = np.array([1.0, 0.0])\n    b = np.array([0.0, 1.0])\n    assert abs(submission.cosine_similarity(a, b)) < 1e-6\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    },
    {
        "slug": "batchnorm",
        "title": "Batch Normalization: Accelerating Deep Network Training",
        "year": 2015,
        "authors": "Ioffe, Szegedy",
        "tags": ["CV", "CNN", "Representation Learning"],
        "description": "Batch Normalization normalizes layer inputs to reduce internal covariate shift, enabling higher learning rates and acting as a regularizer.",
        "original_url": "https://arxiv.org/abs/1502.03167",
        "tasks": [
            {
                "id": "bn01",
                "title": "Batch Norm Forward",
                "description": "## Problem Description\n\nImplement batch normalization forward pass.\n\n## Formula\n```\nx_hat = (x - mean) / sqrt(var + eps)\nout = gamma * x_hat + beta\n```\n\n## Constraints\n- Use pure NumPy\n- Compute mean and variance over the batch dimension",
                "difficulty": "Medium",
                "type": "Micro",
                "boilerplate_code": "import numpy as np\n\ndef batch_norm_forward(x: np.ndarray, gamma: np.ndarray, beta: np.ndarray, eps: float = 1e-5) -> tuple:\n    \"\"\"\n    Batch normalization forward pass.\n    Returns: (output, mean, var)\n    \"\"\"\n    raise NotImplementedError\n",
                "test_code": "import numpy as np\n\ndef test_output_shape():\n    x = np.random.randn(4, 3)\n    gamma = np.ones(3)\n    beta = np.zeros(3)\n    out, mean, var = submission.batch_norm_forward(x, gamma, beta)\n    assert out.shape == (4, 3)\n\ndef test_normalized():\n    x = np.random.randn(100, 3)\n    gamma = np.ones(3)\n    beta = np.zeros(3)\n    out, mean, var = submission.batch_norm_forward(x, gamma, beta)\n    assert np.allclose(out.mean(axis=0), 0, atol=0.1)\n    assert np.allclose(out.std(axis=0), 1, atol=0.1)\n",
                "solution_code": "",
                "time_limit": 2
            }
        ]
    }
]
