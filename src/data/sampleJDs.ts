export interface SampleJDPreset {
  id: string;
  title: string;
  role: string;
  location: string;
  seniority: string;
  industry: string;
  workModel: string;
  summary: string;
  jdText: string;
}

export const SAMPLE_JD_PRESETS: SampleJDPreset[] = [
  {
    id: 'staff-ml-austin',
    title: 'Staff Machine Learning Engineer',
    role: 'Staff Machine Learning Engineer',
    location: 'Austin, TX',
    seniority: 'STAFF',
    industry: 'Autonomous Systems & Generative AI',
    workModel: 'HYBRID',
    summary: 'Distributed model inference, PyTorch, CUDA kernel optimization, LLM fine-tuning, latency-critical real-time serving pipelines.',
    jdText: `Job Title: Staff Machine Learning Engineer
Location: Austin, TX (Hybrid - 3 days on-site in Downtown Austin office)
Department: AI Platform & Intelligent Infrastructure
Employment Type: Full-Time
Experience Level: Staff / Principal (8+ years industry experience)

About the Role:
We are looking for a Staff Machine Learning Engineer to lead the architectural evolution of our large-scale foundation model training and high-throughput real-time inference platform. You will serve as the technical authority across our AI engineering org, bridging deep algorithmic expertise with distributed systems engineering.

Key Responsibilities:
- Architect, build, and optimize low-latency distributed model serving systems processing >50,000 requests/sec with p99 latency < 25ms.
- Lead LLM fine-tuning (LoRA, QLoRA, DPO), model quantization (AWQ, GPTQ), and custom CUDA/Triton kernel optimizations.
- Design resilient MLOps pipelines utilizing Kubernetes, Ray, Kubeflow, and Triton Inference Server.
- Mentor senior engineers, establish AI reliability standards, and collaborate closely with product and infrastructure executives.
- Drive cost-efficiency across large GPU clusters (H100/A100) via smart batching and vLLM integration.

Requirements:
- 8+ years of production software engineering experience, with 5+ years dedicated to ML Systems and Deep Learning engineering.
- Deep mastery of Python, C++, PyTorch, and distributed training paradigms (FSDP, DeepSpeed, Megatron-LM).
- Proven hands-on experience deploying latency-sensitive ML models to production at hyper-scale.
- Strong knowledge of vector databases (Milvus, Pinecone, Qdrant) and RAG architecture.
- B.S., M.S., or Ph.D. in Computer Science, Electrical Engineering, Machine Learning, or related quantitative field.

Preferred Qualifications:
- Prior experience in Autonomous Vehicles, Robotics, or high-throughput Generative AI consumer platforms.
- Active contributor to open-source ML frameworks (e.g., vLLM, HuggingFace, Ray, PyTorch).
- Experience with AWS/GCP GPU orchestration, Slurm, and NCCL network tuning.

Compensation & Benefits:
Target Base Salary: $230,000 - $285,000 USD + Meaningful Equity (RSUs) + 15% Annual Target Bonus.`
  },
  {
    id: 'director-infra-sf',
    title: 'Director of Cloud Platform & Infrastructure',
    role: 'Director of Platform Engineering',
    location: 'San Francisco, CA',
    seniority: 'DIRECTOR',
    industry: 'Enterprise B2B SaaS',
    workModel: 'HYBRID',
    summary: 'Multi-region Kubernetes, Terraform, Platform-as-a-Service internal developer portals, FinOps, SRE, and org leadership of 25+ engineers.',
    jdText: `Title: Director of Cloud Platform & Infrastructure
Company: Apex Cloud Technologies
Location: San Francisco, CA (Hybrid - 2 days/week in SoMa headquarters)
Seniority: Director / Executive
Compensation: $275,000 - $340,000 Base + Equity + Performance Bonus

Role Overview:
Apex is looking for an experienced Director of Cloud Platform & Infrastructure to lead our 28-person Platform, SRE, and Cloud Operations organization. You will define the multi-year infrastructure roadmap for our globally distributed SaaS platform serving 40M daily active users across AWS and GCP.

Responsibilities:
- Lead and scale three engineering squads: Core Platform, Cloud Reliability (SRE), and Developer Productivity.
- Drive the strategy for our Kubernetes-native Internal Developer Platform (IDP), reducing developer onboarding and service deployment cycle times.
- Oversee $20M+ annual cloud compute budget, implementing disciplined FinOps governance and unit-cost metrics.
- Guarantee five-nines (99.999%) platform availability and lead executive disaster recovery and SOC2/ISO27001 compliance programs.
- Partner with VP of Engineering and CPO on architectural strategy, tech debt reduction, and multi-region resilience.

Required Qualifications:
- 12+ years in software engineering and cloud infrastructure, with 5+ years in engineering management (managing managers or large teams).
- Strong track record scaling mission-critical cloud infrastructure at a high-growth SaaS or tier-1 tech enterprise.
- Deep expertise with Kubernetes, Terraform, Istio, Golang/Python, Datadog/Prometheus, and AWS/GCP ecosystems.
- Proven leadership in building a culture of psychological safety, operational rigor, and high talent density.

Nice-to-Have:
- Experience executing multi-region active-active migrations or cloud-to-hybrid repatriations.
- Background in zero-trust security frameworks and SPIFFE/SPIRE identity.`
  },
  {
    id: 'lead-quant-fintech-nyc',
    title: 'Lead Low-Latency Quantitative Systems Engineer',
    role: 'Lead Quantitative Systems Engineer',
    location: 'New York, NY',
    seniority: 'STAFF',
    industry: 'Quantitative Trading & FinTech',
    workModel: 'ON-SITE',
    summary: 'Ultra-low latency C++20, FPGA acceleration, kernel bypass networking (Solarflare, DPDK), market data feeds, lock-free concurrency.',
    jdText: `Position: Lead Low-Latency Quantitative Systems Engineer
Firm: Citadel Ridge Quantitative Capital
Location: New York, NY (Midtown Manhattan - 100% On-Site Trading Floor)
Seniority: Lead / Staff Systems Engineer
Compensation: $275,000 - $350,000 Base + Exceptional Performance Discretionary Bonus (Total comp $550k-$850k+)

About Us:
We are a quantitative trading powerhouse deploying proprietary algorithmic strategies across global equities, options, and fixed income markets.

Role Summary:
We are seeking a world-class Systems Engineer with deep expertise in modern C++ (C++20/23) and hardware-level performance engineering. You will own the core order execution gateway and market data handler where microsecond and sub-microsecond latency dictates alpha.

Core Responsibilities:
- Design and implement deterministic, lock-free, zero-allocation C++ order routing and pricing engines.
- Optimize Linux kernel parameters, CPU core pinning, cache line alignment, and memory barriers for nanosecond execution.
- Build direct exchange feed handlers (ITCH, OUCH, FIX, CME MDP 3.0) with kernel-bypass networking (Solarflare OpenOnload, DPDK).
- Collaborate with quantitative researchers to productionize predictive signal models into real-time trading engines.

Qualifications:
- 7+ years of professional experience in modern low-latency C++ (C++17/20).
- Deep understanding of computer architecture: x86 assembly, memory hierarchy, cache coherency, TLB, branch prediction.
- Experience with socket programming, multicast networking, and network protocols (TCP/IP, UDP, PTP time-sync).
- Degree in Computer Science, Computer Engineering, Physics, or Mathematics.

Desirable:
- Experience with FPGA/NIC acceleration (Verilog/VHDL or High-Level Synthesis).
- Prior background at an electronic market maker, proprietary trading firm, or Tier-1 investment bank.`
  },
  {
    id: 'principal-cyber-remote',
    title: 'Principal Cloud Security Architect',
    role: 'Principal Cloud Security Architect',
    location: 'Remote (US)',
    seniority: 'PRINCIPAL',
    industry: 'Cybersecurity & Defense Tech',
    workModel: 'REMOTE',
    summary: 'Zero Trust architecture, AWS/Azure Security, IAM governance, container runtime security (eBPF, Falco), cryptographic key management, threat modeling.',
    jdText: `Title: Principal Cloud Security Architect
Organization: Sentinel Zero Defense
Location: 100% Remote (United States)
Role Type: Full-Time Principal IC
Compensation: $210,000 - $260,000 Base + Equity + Remote Stipend

Overview:
Sentinel Zero Defense provides next-generation autonomous threat protection for critical defense and commercial infrastructure. We are hiring a Principal Cloud Security Architect to design our enterprise-grade security posture across multi-cloud environments.

Primary Responsibilities:
- Serve as the highest-level individual contributor authority for Cloud Security, Zero Trust Network Architecture, and Identity Governance.
- Architect automated security guardrails in Terraform/OpenTofu, CSPM, CI/CD pipelines, and runtime container environments using eBPF and Falco.
- Lead cryptographic architecture for data-at-rest and in-transit, KMS, HSM integrations, and quantum-resistant algorithm readiness.
- Perform deep threat modeling on novel cloud features, API gateways, and distributed microservice meshes.

Requirements:
- 10+ years in Information Security and Software Engineering, with 5+ years focused on AWS/GCP/Azure cloud security architecture.
- Subject matter expertise in IAM least-privilege automation, OIDC federation, SPIFFE/SPIRE, and Kubernetes security (CKS level).
- Hands-on coding ability in Go or Python for custom security tooling and policy-as-code (OPA/Rego).
- Recognized certifications (CISSP, CCSP, AWS Certified Security Specialty) or demonstrable thought leadership.

Benefits:
- Competitive base + high equity upside
- Unlimited PTO, 401(k) 6% match, comprehensive healthcare, $4,000 annual home office & conference budget.`
  }
];
