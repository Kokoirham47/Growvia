import { PrismaClient, LearningResourceType, Difficulty, ContentSource } from '@prisma/client'

const prisma = new PrismaClient()

interface LearningSeedData {
  title: string
  platform: string
  url: string
  type: LearningResourceType
  difficulty: Difficulty
  durationMinutes: number
  rating: number
  description: string
  instructor?: string
  reviewsCount?: string
  enrolledCount?: string
  hasCertificate?: boolean
  portfolioProjectsCount?: number
  syllabus?: Array<{
    moduleNumber: number
    title: string
    duration: string
    topics: string[]
  }>
  skillNames: string[]
}

const LEARNING_RESOURCES_DATA: LearningSeedData[] = [
  // 1. Featured Resource - Machine Learning Specialization
  {
    title: 'Machine Learning Specialization with Python & Scikit-Learn',
    platform: 'Coursera & DeepLearning.AI',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    type: LearningResourceType.course,
    difficulty: Difficulty.intermediate,
    durationMinutes: 840,
    rating: 4.9,
    reviewsCount: '1.2k ulasan',
    enrolledCount: '14,250 siswa',
    portfolioProjectsCount: 3,
    hasCertificate: true,
    instructor: 'Andrew Ng & DeepLearning.AI Team',
    description:
      'Kuasai algoritma Supervised & Unsupervised Learning, gradient descent, neural network foundations, dan best practices tuning Scikit-Learn langsung dengan studi kasus nyata.',
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
    ],
    skillNames: ['Machine Learning', 'Python']
  },

  // 2. Python for Data Science & Applied Machine Learning
  {
    title: 'Python for Data Science & Applied Machine Learning',
    platform: 'Coursera',
    url: 'https://www.coursera.org',
    type: LearningResourceType.course,
    difficulty: Difficulty.intermediate,
    durationMinutes: 720,
    rating: 4.9,
    reviewsCount: '890 ulasan',
    enrolledCount: '9,800 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Dr. Charles Severance',
    description:
      'Kuasai manipulasi data kompleks menggunakan NumPy, Pandas, serta implementasikan pipeline pemodelan dasar untuk studi kasus klasifikasi dan regresi industri.',
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
    ],
    skillNames: ['Python', 'Data Processing & SQL']
  },

  // 3. Hands-on PyTorch for Deep Learning Projects
  {
    title: 'Hands-on PyTorch for Deep Learning Projects',
    platform: 'Fast.ai',
    url: 'https://www.fast.ai',
    type: LearningResourceType.course,
    difficulty: Difficulty.intermediate,
    durationMinutes: 480,
    rating: 4.8,
    reviewsCount: '620 ulasan',
    enrolledCount: '6,400 siswa',
    portfolioProjectsCount: 3,
    hasCertificate: true,
    instructor: 'Jeremy Howard & Rachel Thomas',
    description:
      'Membangun arsitektur Computer Vision dan NLP modern dari nol menggunakan PyTorch, mulai dari layer kustom hingga fine-tuning pretrained model vision.',
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
    ],
    skillNames: ['Machine Learning', 'Python']
  },

  // 4. Building Robust Data Pipelines with SQL & Airflow
  {
    title: 'Building Robust Data Pipelines with SQL & Airflow',
    platform: 'Dicoding',
    url: 'https://www.dicoding.com',
    type: LearningResourceType.course,
    difficulty: Difficulty.intermediate,
    durationMinutes: 600,
    rating: 4.8,
    reviewsCount: '450 ulasan',
    enrolledCount: '4,100 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Tim Kurikulum Cloud Dicoding',
    description:
      'Pelajari orkestrasi pipeline data otomatis, query agregasi SQL analitik berskala besar, serta integrasi webhook untuk ingestion data pelatihan model AI.',
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
    ],
    skillNames: ['Data Processing & SQL', 'MLOps & CI/CD Pipeline']
  },

  // 5. Data Cleaning & Preprocessing Masterclass
  {
    title: 'Data Cleaning & Preprocessing Masterclass',
    platform: 'YouTube Tech',
    url: 'https://www.youtube.com',
    type: LearningResourceType.video,
    difficulty: Difficulty.beginner,
    durationMinutes: 360,
    rating: 4.7,
    reviewsCount: '1.5k ulasan',
    enrolledCount: '18,500 views',
    portfolioProjectsCount: 1,
    hasCertificate: false,
    instructor: 'Krish Naik & StatQuest',
    description:
      'Teknik penanganan missing values, outlier imputation, scaling, serta feature engineering untuk menjaga akurasi model dari data kotor di dunia nyata.',
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
    ],
    skillNames: ['Data Processing & SQL', 'Problem Solving & Logic']
  },

  // 6. FastApi & Docker: Model Deployment untuk AI Engineer
  {
    title: 'FastAPI & Docker: Model Deployment untuk AI Engineer',
    platform: 'Towards Data Science & Growvia',
    url: 'https://towardsdatascience.com',
    type: LearningResourceType.article,
    difficulty: Difficulty.intermediate,
    durationMinutes: 45,
    rating: 4.9,
    reviewsCount: '520 likes',
    enrolledCount: '3,200 readers',
    portfolioProjectsCount: 1,
    hasCertificate: false,
    instructor: 'Senior MLOps Architect',
    description:
      'Tutorial langkah-demi-langkah mengemas model PyTorch/Scikit menjadi REST API asinkron dengan FastAPI, dockerizing multi-stage build, dan deploy serverless ke GCP Cloud Run.',
    skillNames: ['Model Deployment (FastAPI / Docker)', 'Cloud Computing (GCP/AWS)']
  },

  // 7. MLOps Fundamentals: Continuous Training & GitHub Actions
  {
    title: 'MLOps Fundamentals: Continuous Training & GitHub Actions',
    platform: 'Growvia Lab x Google Developer Group',
    url: 'https://growvia.app/learning/mlops-continuous-delivery',
    type: LearningResourceType.bootcamp,
    difficulty: Difficulty.intermediate,
    durationMinutes: 1800,
    rating: 4.8,
    reviewsCount: '310 alumni',
    enrolledCount: '420 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Staff MLOps Engineer & GDG Leads',
    description:
      'Pelajari otomatisasi retraining model machine learning dengan DVC, CVC, model registry di MLflow, dan deployment otomatis dengan GitHub Actions.',
    skillNames: ['MLOps & CI/CD Pipeline', 'Cloud Computing (GCP/AWS)']
  },

  // 8. AI Engineering & Production MLOps Immersive Bootcamp 2026
  {
    title: 'AI Engineering & Production MLOps Immersive Bootcamp 2026',
    platform: 'Hacktiv8 & Dicoding',
    url: 'https://hacktiv8.com',
    type: LearningResourceType.bootcamp,
    difficulty: Difficulty.advanced,
    durationMinutes: 7200,
    rating: 4.9,
    reviewsCount: '320 alumni',
    enrolledCount: '65 siswa per batch',
    portfolioProjectsCount: 4,
    hasCertificate: true,
    instructor: 'Staff AI Engineers & Cloud Architects',
    description:
      'Program intensif akselerasi karier dengan mentoring live 1-on-1, kurikulum industri tier 1, cloud compute GPU credits, dan jaminan interview kerja partner.',
    skillNames: ['Machine Learning', 'MLOps & CI/CD Pipeline', 'Model Deployment (FastAPI / Docker)']
  },

  // 9. Figma Tokens & Design System Architecture (DESIGN)
  {
    title: 'Figma Tokens & Design System Architecture',
    platform: 'Growvia Academy x Design Systems Indonesia',
    url: 'https://growvia.app/learning/design-tokens-mastery',
    type: LearningResourceType.video,
    difficulty: Difficulty.intermediate,
    durationMinutes: 240,
    rating: 4.9,
    reviewsCount: '980 likes',
    enrolledCount: '5,400 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Lead Product Designer GovTech Edu',
    description:
      'Panduan komprehensif implementasi Design Tokens menggunakan Tokens Studio for Figma, sinkronisasi GitHub token repository, dan auto-theming Dark/Light mode.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Design Token Taxonomy & Primitive Sets',
        duration: '1 Jam',
        topics: ['Color, typography & spacing primitives', 'Semantic aliasing', 'Multi-brand token setup']
      },
      {
        moduleNumber: 2,
        title: 'Tokens Studio x Figma Variables Bridge',
        duration: '1.5 Jam',
        topics: ['Variable collections', 'Mode switching', 'Auto-exporting tokens ke JSON']
      },
      {
        moduleNumber: 3,
        title: 'Handoff to Engineering & Style-Dictionary',
        duration: '1.5 Jam',
        topics: ['GitHub integration', 'Style-dictionary pipeline', 'Validasi token di Pull Request']
      }
    ],
    skillNames: ['Design System & Tokens', 'Figma & Auto-layout']
  },

  // 10. Advanced User Research Synthesis & Usability Metrics (DESIGN)
  {
    title: 'Advanced User Research Synthesis & Usability Metrics',
    platform: 'UX Indonesia Association',
    url: 'https://growvia.app/learning/advanced-user-research-synthesis',
    type: LearningResourceType.bootcamp,
    difficulty: Difficulty.advanced,
    durationMinutes: 1200,
    rating: 4.9,
    reviewsCount: '410 alumni',
    enrolledCount: '1,200 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Principal UX Researcher',
    description:
      'Kuasai metode riset kualitatif & kuantitatif, usability testing moderasi vs tanpa moderasi, System Usability Scale (SUS), serta visualisasi affinity mapping berdampak tinggi.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Research Plan, Protocol & Participant Screening',
        duration: '3 Jam',
        topics: ['Formulasi research question', 'Screener survey best practices', 'Nielsen Norman heuristics']
      },
      {
        moduleNumber: 2,
        title: 'Moderated Usability Testing & Live Observation',
        duration: '4 Jam',
        topics: ['Think-aloud protocol', 'Task completion rate & time-on-task', 'Avoiding facilitator bias']
      },
      {
        moduleNumber: 3,
        title: 'Insight Synthesis & Executive Stakeholder Presentation',
        duration: '3 Jam',
        topics: ['Affinity diagramming', 'Prioritization matrix (Impact vs Effort)', 'Actionable recommendation report']
      }
    ],
    skillNames: ['User Research & Testing', 'Cross-functional Comm.']
  },

  // 11. Wireframing & High-Fidelity Prototyping in Figma (DESIGN)
  {
    title: 'Wireframing & High-Fidelity Prototyping in Figma',
    platform: 'Interaction Design Foundation',
    url: 'https://interaction-design.org',
    type: LearningResourceType.course,
    difficulty: Difficulty.beginner,
    durationMinutes: 420,
    rating: 4.8,
    reviewsCount: '1.3k ulasan',
    enrolledCount: '7,800 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Senior UI/UX Specialist',
    description:
      'Dari low-fidelity wireframes kertas hingga interactive high-fidelity prototype dengan Smart Animate, interactive components, dan layout responsive auto-layout.',
    skillNames: ['Wireframing & Prototyping', 'Figma & Auto-layout']
  },

  // 12. Product Analytics Fundamental: Mixpanel & Google Analytics 4 (PM / DESIGN)
  {
    title: 'Product Analytics Fundamental: Mixpanel & Google Analytics 4',
    platform: 'Growvia Lab x Product School ID',
    url: 'https://growvia.app/learning/product-analytics-hands-on',
    type: LearningResourceType.course,
    difficulty: Difficulty.intermediate,
    durationMinutes: 480,
    rating: 4.8,
    reviewsCount: '620 ulasan',
    enrolledCount: '3,800 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Head of Growth & Product Analytics',
    description:
      'Pelajari event taxonomy mapping, funnel analysis, cohort retention, dan A/B test statistical significance untuk membuat keputusan produk berbasis bukti data.',
    syllabus: [
      {
        moduleNumber: 1,
        title: 'Event Taxonomy & Tracking Schema',
        duration: '2 Jam',
        topics: ['Track events vs user properties', 'Naming convention standard', 'Tracking plan spreadsheet']
      },
      {
        moduleNumber: 2,
        title: 'Funnels, Retention & Segmentation Deep Dive',
        duration: '3 Jam',
        topics: ['Drop-off analysis', 'N-day cohort retention curve', 'Power user curve (L28 analysis)']
      },
      {
        moduleNumber: 3,
        title: 'A/B Testing & Metric Decision Framework',
        duration: '3 Jam',
        topics: ['North Star Metric vs Input metrics', 'Statistical significance (p-value, sample size)', 'Post-experiment analysis']
      }
    ],
    skillNames: ['Product Analytics (Mixpanel / GA4)', 'Quantitative & Market Analytics']
  },

  // 13. Modern React 19 & Next.js App Router Mastery (FRONTEND)
  {
    title: 'Modern React 19 & Next.js App Router Mastery',
    platform: 'Growvia Tech Lab',
    url: 'https://growvia.app/learning/nextjs-app-router-deep-dive',
    type: LearningResourceType.course,
    difficulty: Difficulty.advanced,
    durationMinutes: 600,
    rating: 4.9,
    reviewsCount: '840 ulasan',
    enrolledCount: '6,100 siswa',
    portfolioProjectsCount: 3,
    hasCertificate: true,
    instructor: 'Staff Frontend Engineer',
    description:
      'Pelajari Server Components, Server Actions, streaming SSR dengan Suspense, parallel routes, dan optimasi Core Web Vitals pada aplikasi Next.js skala enterprise.',
    skillNames: ['Next.js & SSR', 'React.js', 'TypeScript']
  },

  // 14. TypeScript for Production Frontend Architecture (FRONTEND)
  {
    title: 'TypeScript for Production Frontend Architecture',
    platform: 'Frontend Masters',
    url: 'https://frontendmasters.com',
    type: LearningResourceType.course,
    difficulty: Difficulty.intermediate,
    durationMinutes: 360,
    rating: 4.9,
    reviewsCount: '750 ulasan',
    enrolledCount: '4,900 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Matt Pocock',
    description:
      'Generics tingkat lanjut, conditional types, template literal types, type narrowing, dan best practices konfigurasi tsconfig untuk frontend modern yang aman.',
    skillNames: ['TypeScript', 'React.js']
  },

  // 15. Tailwind CSS & Modern Component Design Systems (FRONTEND)
  {
    title: 'Tailwind CSS & Modern Component Design Systems',
    platform: 'Egghead.io',
    url: 'https://egghead.io',
    type: LearningResourceType.video,
    difficulty: Difficulty.beginner,
    durationMinutes: 180,
    rating: 4.8,
    reviewsCount: '920 likes',
    enrolledCount: '8,200 views',
    portfolioProjectsCount: 1,
    hasCertificate: false,
    instructor: 'Tailwind Labs Contributor',
    description:
      'Bangun komponen UI kelas dunia dengan Tailwind CSS, arbitrary values, layout container queries, plugin styling kustom, dan animasi transisi halus.',
    skillNames: ['Tailwind CSS & Component UI', 'React.js']
  },

  // 16. Product Discovery & Opportunity Solution Tree (PM)
  {
    title: 'Product Discovery & Opportunity Solution Tree Framework',
    platform: 'Product Talk & Growvia',
    url: 'https://producttalk.org',
    type: LearningResourceType.article,
    difficulty: Difficulty.intermediate,
    durationMinutes: 30,
    rating: 4.9,
    reviewsCount: '680 claps',
    enrolledCount: '2,800 readers',
    portfolioProjectsCount: 1,
    hasCertificate: false,
    instructor: 'Teresa Torres Alumni',
    description:
      'Panduan taktis menerapkan continuous discovery habits, memetakan Opportunity Solution Trees (OST), serta memprioritaskan hipotesis problem vs solution.',
    skillNames: ['Product Discovery & Strategy', 'Stakeholder Management']
  },

  // 17. Agile Sprint Execution & Cross-Functional Team Leadership (PM)
  {
    title: 'Agile Sprint Execution & Cross-Functional Team Leadership',
    platform: 'Scrum Alliance & Dicoding',
    url: 'https://scrumalliance.org',
    type: LearningResourceType.bootcamp,
    difficulty: Difficulty.intermediate,
    durationMinutes: 900,
    rating: 4.8,
    reviewsCount: '230 alumni',
    enrolledCount: '340 siswa',
    portfolioProjectsCount: 2,
    hasCertificate: true,
    instructor: 'Certified Scrum Master (CSM)',
    description:
      'Simulasi mengelola backlog, sprint planning, daily standup, backlog refinement, dan retrospektif lintas fungsi engineering, design, dan business.',
    skillNames: ['Agile / Scrum Methodology', 'Cross-functional Comm.', 'Stakeholder Management']
  }
]

async function seedLearningResources() {
  console.log('🌱 Starting Learning Resources Seeding...')

  // Fetch all skills from Supabase
  const existingSkills = await prisma.skill.findMany()
  const skillMap: Record<string, string> = {}
  for (const s of existingSkills) {
    skillMap[s.name.toLowerCase().trim()] = s.id
  }

  for (const item of LEARNING_RESOURCES_DATA) {
    const existing = await prisma.learningResource.findFirst({
      where: { title: item.title }
    })

    const resource = existing
      ? await prisma.learningResource.update({
          where: { id: existing.id },
          data: {
            platform: item.platform,
            url: item.url,
            type: item.type,
            difficulty: item.difficulty,
            durationMinutes: item.durationMinutes,
            rating: item.rating,
            description: item.description,
            instructor: item.instructor,
            reviewsCount: item.reviewsCount,
            enrolledCount: item.enrolledCount,
            hasCertificate: item.hasCertificate ?? true,
            portfolioProjectsCount: item.portfolioProjectsCount ?? 1,
            syllabus: (item.syllabus as any) ?? null,
            source: ContentSource.admin,
            isActive: true
          }
        })
      : await prisma.learningResource.create({
          data: {
            title: item.title,
            platform: item.platform,
            url: item.url,
            type: item.type,
            difficulty: item.difficulty,
            durationMinutes: item.durationMinutes,
            rating: item.rating,
            description: item.description,
            instructor: item.instructor,
            reviewsCount: item.reviewsCount,
            enrolledCount: item.enrolledCount,
            hasCertificate: item.hasCertificate ?? true,
            portfolioProjectsCount: item.portfolioProjectsCount ?? 1,
            syllabus: (item.syllabus as any) ?? null,
            source: ContentSource.admin,
            isActive: true
          }
        })

    // Attach skill tags
    for (const sName of item.skillNames) {
      const sId = skillMap[sName.toLowerCase().trim()]
      if (sId) {
        await prisma.resourceSkillTag.upsert({
          where: {
            learningResourceId_skillId: {
              learningResourceId: resource.id,
              skillId: sId
            }
          },
          update: {},
          create: {
            learningResourceId: resource.id,
            skillId: sId
          }
        })
      } else {
        console.warn(`⚠️ Skill not found in master: "${sName}" for resource "${item.title}"`)
      }
    }
  }

  const count = await prisma.learningResource.count()
  console.log(`✅ Seeding finished! Total active learning resources in Supabase: ${count}`)
}

seedLearningResources()
  .catch(e => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
