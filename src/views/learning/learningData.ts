import type { LearningCardItem } from '@/types/learning'

export const FEATURED_LEARNING_RESOURCE: LearningCardItem = {
  id: 'feat-ml-specialization',
  title: 'Machine Learning Specialization with Python & Scikit-Learn',
  category: 'course',
  skillTag: 'Machine Learning',
  platform: 'Coursera & DeepLearning.AI',
  duration: '14 Jam total',
  difficulty: 'Intermediate',
  rating: 4.9,
  reviewsCount: '1.2k ulasan',
  description:
    'Kuasai algoritma Supervised & Unsupervised Learning, gradient descent, neural network foundations, dan best practices tuning Scikit-Learn langsung dengan studi kasus nyata.',
  matchPercent: 98,
  url: 'https://www.coursera.org/specializations/machine-learning-introduction',
  isFeatured: true,
  instructor: 'Andrew Ng & DeepLearning.AI Team',
  enrolledCount: '14,250 siswa',
  portfolioProjectsCount: 3,
  hasCertificate: true,
  reasonAI:
    'Sangat relevan untuk menutup gap keahlian **Machine Learning Fundamentals** yang saat ini diwajibkan oleh 92% lowongan AI Engineer entry-level.',
  syllabus: [
    {
      moduleNumber: 1,
      title: 'Supervised Machine Learning: Regression and Classification',
      duration: '4 Jam',
      topics: [
        'Linear Regression dengan Single & Multiple Variables',
        'Cost Function & Gradient Descent Convergence',
        'Logistic Regression untuk Klasifikasi Biner',
        'Overfitting, Regularization L1 & L2 (Ridge & Lasso)'
      ]
    },
    {
      moduleNumber: 2,
      title: 'Advanced Learning Algorithms & Neural Networks',
      duration: '5 Jam',
      topics: [
        'Arsitektur Feedforward Neural Networks dengan Scikit/TensorFlow',
        'Activation Functions (ReLU, Sigmoid, Softmax)',
        'Decision Trees, Random Forests, & XGBoost Ensemble',
        'Model Evaluation: Precision, Recall, F1-Score, ROC-AUC'
      ]
    },
    {
      moduleNumber: 3,
      title: 'Unsupervised Learning, Recommenders, & Reinforcement Learning',
      duration: '5 Jam',
      topics: [
        'K-Means Clustering & Principal Component Analysis (PCA)',
        'Anomaly Detection untuk Deteksi Fraud Data',
        'Collaborative Filtering untuk Sistem Rekomendasi E-Commerce',
        'Mini-Project: End-to-End Pipeline Scikit-Learn Production'
      ]
    }
  ]
}

export const LEARNING_RESOURCES: LearningCardItem[] = [
  // 1. Python for Data Science (Course) - Mockup Card 1
  {
    id: 'course-python-ds',
    title: 'Python for Data Science & Applied Machine Learning',
    category: 'course',
    skillTag: 'Python for Data Science',
    platform: 'Coursera',
    duration: '12 Jam',
    difficulty: 'Intermediate',
    rating: 4.9,
    reviewsCount: '890 ulasan',
    description:
      'Kuasai manipulasi data kompleks menggunakan NumPy, Pandas, serta implementasikan pipeline pemodelan dasar untuk studi kasus klasifikasi dan regresi industri.',
    matchPercent: 96,
    url: 'https://www.coursera.org',
    instructor: 'Dr. Charles Severance',
    enrolledCount: '9,800 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    syllabus: [
      {
        moduleNumber: 1,
        title: 'High-Performance NumPy & Pandas Vectorization',
        duration: '3.5 Jam',
        topics: ['Array indexing & broadcasting', 'Handling time series data', 'Memory optimization']
      },
      {
        moduleNumber: 2,
        title: 'Exploratory Data Analysis & Advanced Visualization',
        duration: '4 Jam',
        topics: ['Seaborn & Matplotlib custom themes', 'Statistical significance in EDA', 'Outlier detection']
      },
      {
        moduleNumber: 3,
        title: 'End-to-End Baseline Modeling',
        duration: '4.5 Jam',
        topics: ['Scikit-Learn transformers', 'Cross-validation strategies', 'Pipeline serialization']
      }
    ]
  },

  // 2. Hands-on PyTorch for Deep Learning Projects (Course) - Mockup Card 2
  {
    id: 'course-pytorch-dl',
    title: 'Hands-on PyTorch for Deep Learning Projects',
    category: 'course',
    skillTag: 'Neural Networks & PyTorch',
    platform: 'Fast.ai',
    duration: '8 Jam',
    difficulty: 'Intermediate',
    rating: 4.8,
    reviewsCount: '620 ulasan',
    description:
      'Membangun arsitektur Computer Vision dan NLP modern dari nol menggunakan PyTorch, mulai dari layer kustom hingga fine-tuning pretrained model vision.',
    matchPercent: 94,
    url: 'https://www.fast.ai',
    instructor: 'Jeremy Howard & Rachel Thomas',
    enrolledCount: '6,400 siswa',
    portfolioProjectsCount: 3,
    hasCertificate: true,
    syllabus: [
      {
        moduleNumber: 1,
        title: 'PyTorch Tensors, Autograd & GPU Acceleration',
        duration: '2.5 Jam',
        topics: ['CUDA device allocation', 'Computational graph mechanics', 'Custom loss functions']
      },
      {
        moduleNumber: 2,
        title: 'Convolutional Neural Networks (CNN) & Transfer Learning',
        duration: '3 Jam',
        topics: ['ResNet backbones', 'Data augmentation pipelines', 'Feature extraction vs fine-tuning']
      },
      {
        moduleNumber: 3,
        title: 'Modern NLP with HuggingFace & PyTorch Lightning',
        duration: '2.5 Jam',
        topics: ['Tokenizers & Embeddings', 'Transformer blocks', 'PyTorch Lightning modular structure']
      }
    ]
  },

  // 3. Building Robust Data Pipelines with SQL & Airflow (Course) - Mockup Card 3
  {
    id: 'course-data-pipelines-airflow',
    title: 'Building Robust Data Pipelines with SQL & Airflow',
    category: 'course',
    skillTag: 'Data Pipeline & ETL',
    platform: 'Dicoding',
    duration: '10 Jam',
    difficulty: 'Intermediate',
    rating: 4.8,
    reviewsCount: '450 ulasan',
    description:
      'Pelajari orkestrasi pipeline data otomatis, query agregasi SQL analitik berskala besar, serta integrasi webhook untuk ingestion data pelatihan model AI.',
    matchPercent: 90,
    url: 'https://www.dicoding.com',
    instructor: 'Tim Kurikulum Cloud Dicoding',
    enrolledCount: '4,100 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Advanced Analytical SQL & Partitioning',
        duration: '3 Jam',
        topics: ['Window functions (ROW_NUMBER, DENSE_RANK)', 'CTE optimizations', 'Schema design for ML datasets']
      },
      {
        moduleNumber: 2,
        title: 'Apache Airflow DAG Authoring & Scheduling',
        duration: '4 Jam',
        topics: ['Task dependencies & operators', 'Sensors & SLA management', 'Airflow connections & secrets']
      },
      {
        moduleNumber: 3,
        title: 'Automated ML Ingestion & Data Validation',
        duration: '3 Jam',
        topics: ['Great Expectations validation', 'Automated Slack/Email alerts', 'Backfill strategies']
      }
    ]
  },

  // 4. Data Cleaning & Preprocessing Masterclass (Course) - Mockup Card 4
  {
    id: 'course-data-cleaning',
    title: 'Data Cleaning & Preprocessing Masterclass',
    category: 'course',
    skillTag: 'Model Evaluation & MLOps',
    platform: 'YouTube Tech',
    duration: '6 Jam',
    difficulty: 'Beginner',
    rating: 4.7,
    reviewsCount: '1.5k ulasan',
    description:
      'Teknik penanganan missing values, outlier imputation, scaling, serta feature engineering untuk menjaga akurasi model dari data kotor di dunia nyata.',
    matchPercent: 86,
    url: 'https://www.youtube.com',
    instructor: 'Krish Naik & StatQuest',
    enrolledCount: '18,500 views',
    portfolioProjectsCount: 1,
    hasCertificate: false,
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Diagnosing Data Defects & Leakage',
        duration: '2 Jam',
        topics: ['MCAR vs MAR missing values', 'Target leakage prevention', 'Collinearity checks']
      },
      {
        moduleNumber: 2,
        title: 'Scalable Imputation & Encoding Strategies',
        duration: '2 Jam',
        topics: ['KNN & MICE imputers', 'Target encoding vs Weight of Evidence', 'Quantile transformers']
      },
      {
        moduleNumber: 3,
        title: 'Building Scikit-Learn Reusable Pipelines',
        duration: '2 Jam',
        topics: ['Custom BaseEstimator & TransformerMixin', 'ColumnTransformer composition', 'Unit testing data transforms']
      }
    ]
  },

  // 5. Mathematics for Machine Learning (Course 5)
  {
    id: 'course-math-ml',
    title: 'Mathematics for Machine Learning: Linear Algebra & Calculus',
    category: 'course',
    skillTag: 'AI Foundations & Math',
    platform: 'Coursera',
    duration: '16 Jam',
    difficulty: 'Beginner',
    rating: 4.8,
    reviewsCount: '1.1k ulasan',
    description:
      'Fondasi matematika esensial untuk AI: vektor, matriks, eigenvalue/eigenvector, gradien parsial, dan optimasi matematis dalam gradient descent.',
    matchPercent: 87,
    url: 'https://www.coursera.org',
    instructor: 'Imperial College London',
    enrolledCount: '8,200 siswa',
    portfolioProjectsCount: 1,
    hasCertificate: true
  },

  // 6. Feature Store Architecture & Real-Time Engineering (Course 6)
  {
    id: 'course-feature-store',
    title: 'Feature Store Architecture & Real-Time Feature Engineering',
    category: 'course',
    skillTag: 'MLOps & Systems',
    platform: 'Feast.dev',
    duration: '5 Jam',
    difficulty: 'Advanced',
    rating: 4.7,
    reviewsCount: '240 ulasan',
    description:
      'Implementasikan Feast feature store untuk sinkronisasi fitur offline pelatihan batch dan online inference latensi rendah di lingkungan produksi.',
    matchPercent: 85,
    url: 'https://feast.dev',
    instructor: 'Willem Pienaar',
    enrolledCount: '1,900 siswa',
    portfolioProjectsCount: 1,
    hasCertificate: true
  },

  // 7. Comprehensive Guide: Deploying Scikit & PyTorch Models with FastAPI & Docker (Artikel 1)
  {
    id: 'artikel-deploy-fastapi',
    title: 'Panduan Lengkap: Deploy Model AI Menggunakan FastAPI, Docker, & GCP Cloud Run',
    category: 'artikel',
    skillTag: 'Model Deployment',
    platform: 'Towards Data Science',
    duration: '45 Menit baca',
    difficulty: 'Intermediate',
    rating: 4.9,
    reviewsCount: '520 likes',
    description:
      'Tutorial langkah-demi-langkah mengemas model PyTorch/Scikit menjadi REST API asinkron dengan FastAPI, dockerizing multi-stage build, dan deploy serverless.',
    matchPercent: 93,
    url: 'https://towardsdatascience.com',
    instructor: 'Senior MLOps Architect',
    portfolioProjectsCount: 1,
    hasCertificate: false
  },

  // 8. Understanding Attention Mechanism & Transformers from Scratch (Artikel 2)
  {
    id: 'artikel-transformer-attention',
    title: 'Memahami Self-Attention & Transformer Architecture dari Dasar Matematis ke Kode',
    category: 'artikel',
    skillTag: 'Natural Language Processing',
    platform: 'Distill.pub',
    duration: '30 Menit baca',
    difficulty: 'Advanced',
    rating: 4.9,
    reviewsCount: '840 likes',
    description:
      'Visualisasi interaktif mengenai matriks Query, Key, Value, multi-head attention, positional encoding, serta implementasi PyTorch ringkas.',
    matchPercent: 91,
    url: 'https://distill.pub',
    instructor: 'AI Research Scientist',
    portfolioProjectsCount: 1,
    hasCertificate: false
  },

  // 9. MLOps Architecture Patterns for Production AI Systems (Artikel 3)
  {
    id: 'artikel-mlops-patterns',
    title: 'Pola Arsitektur MLOps untuk Sistem AI Produksi Skala Unicorn',
    category: 'artikel',
    skillTag: 'MLOps & Architecture',
    platform: 'Medium AI Tech',
    duration: '25 Menit baca',
    difficulty: 'Intermediate',
    rating: 4.8,
    reviewsCount: '410 likes',
    description:
      'Analisis arsitektur model registry, continuous training, drift detection, dan canary release untuk sistem machine learning dengan traffic tinggi.',
    matchPercent: 88,
    url: 'https://medium.com',
    instructor: 'Head of AI Engineering',
    portfolioProjectsCount: 1,
    hasCertificate: false
  },

  // 10. Visualizing Deep Learning Backpropagation in 3D (Video 1)
  {
    id: 'video-3blue1brown-dl',
    title: 'Visualisasi Intuisi Neural Networks & Backpropagation 3D',
    category: 'video',
    skillTag: 'Deep Learning Foundations',
    platform: 'YouTube Tech (3Blue1Brown)',
    duration: '2.5 Jam',
    difficulty: 'Beginner',
    rating: 4.9,
    reviewsCount: '12.4k likes',
    description:
      'Penjelasan animasi geometris terbaik tentang kalkulus turunan berantai, manifold loss surfaces, dan momentum optimizer dalam deep learning.',
    matchPercent: 95,
    url: 'https://www.youtube.com',
    instructor: 'Grant Sanderson',
    portfolioProjectsCount: 0,
    hasCertificate: false
  },

  // 11. Full-Stack AI Application: LangChain + Next.js + Vector DB Walkthrough (Video 2)
  {
    id: 'video-langchain-rag',
    title: 'Membangun Aplikasi Fullstack RAG: LangChain, Qdrant Vector DB, & Next.js 15',
    category: 'video',
    skillTag: 'Generative AI & LLMs',
    platform: 'YouTube Tech (FreeCodeCamp)',
    duration: '4 Jam',
    difficulty: 'Intermediate',
    rating: 4.8,
    reviewsCount: '3.1k likes',
    description:
      'Praktik langsung membuat knowledge assistant AI cerdas dengan chunking dokumen, vector embeddings, semantic retrieval, dan streaming chat UI responsif.',
    matchPercent: 89,
    url: 'https://www.freecodecamp.org',
    instructor: 'Senior Fullstack AI Developer',
    portfolioProjectsCount: 1,
    hasCertificate: false
  },

  // 12. AI Engineering & MLOps Immersive Bootcamp (Bootcamp 1)
  {
    id: 'bootcamp-ai-immersive',
    title: 'AI Engineering & Production MLOps Immersive Bootcamp 2026',
    category: 'bootcamp',
    skillTag: 'End-to-End AI Engineering',
    platform: 'Hacktiv8 & Dicoding',
    duration: '12 Minggu (Intensif)',
    difficulty: 'Advanced',
    rating: 4.9,
    reviewsCount: '320 alumni',
    description:
      'Program intensif akselerasi karier dengan mentoring live 1-on-1, kurikulum industri tier 1, cloud compute GPU credits, dan jaminan interview kerja partner.',
    matchPercent: 98,
    url: 'https://hacktiv8.com',
    instructor: 'Staff AI Engineers & Cloud Architects',
    enrolledCount: '65 siswa per batch',
    portfolioProjectsCount: 4,
    hasCertificate: true
  }
]
