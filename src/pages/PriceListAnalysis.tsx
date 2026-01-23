import { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  FileEdit,
  FileText,
  Download,
  Upload,
  Play,
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  FileSpreadsheet,
  Sparkles,
  ArrowRight,
  Eye,
  Loader2,
  ChevronDownIcon,
} from "lucide-react";
import api from "../lib/axios";

interface Client {
  client_id: string;
  company_name: string;
  contract_number: string;
}

// Mock data for clients with full contract details
const mockClients = [
  {
    id: "1",
    name: "Acme Corp",
    contract: "GS-35F-0001Y",
    products: 1250,
    sin: "54151S, 54151HEAL",
    contractingOfficer: "Maria Garcia",
    coId: "MG-2847",
    gsaAddress: "1800 F Street NW",
    gsaCity: "Washington, DC 20405",
    consultant: "John Smith",
    consultantPhone: "(703) 555-0142",
    consultantEmail: "jsmith@winvale.com",
    authNegotiator: "Robert Chen",
    authTitle: "VP of Federal Sales",
    gsaDiscount: "20%",
    volumeDiscount: "5%",
    deliveryNormal: "30 days ARO",
    deliveryExpedited: "15 days ARO",
    fobTerms: "Destination",
    countryOfOrigin: "USA",
  },
  {
    id: "2",
    name: "TechVentures Inc",
    contract: "GS-07F-0123X",
    products: 3400,
    sin: "33411, 334111",
    contractingOfficer: "James Anderson",
    coId: "JA-1923",
    gsaAddress: "10304 Eaton Place",
    gsaCity: "Fairfax, VA 22030",
    consultant: "Sarah Johnson",
    consultantPhone: "(703) 555-0198",
    consultantEmail: "sjohnson@winvale.com",
    authNegotiator: "Emily Wilson",
    authTitle: "Director of Government Contracts",
    gsaDiscount: "18%",
    volumeDiscount: "3%",
    deliveryNormal: "45 days ARO",
    deliveryExpedited: "20 days ARO",
    fobTerms: "Destination",
    countryOfOrigin: "USA",
  },
  {
    id: "3",
    name: "Global Solutions",
    contract: "GS-00F-0456Z",
    products: 890,
    sin: "541611",
    contractingOfficer: "Patricia Martinez",
    coId: "PM-3651",
    gsaAddress: "2200 Crystal Drive",
    gsaCity: "Arlington, VA 22202",
    consultant: "Mike Chen",
    consultantPhone: "(703) 555-0167",
    consultantEmail: "mchen@winvale.com",
    authNegotiator: "David Lee",
    authTitle: "CEO",
    gsaDiscount: "22%",
    volumeDiscount: "7%",
    deliveryNormal: "21 days ARO",
    deliveryExpedited: "10 days ARO",
    fobTerms: "Origin",
    countryOfOrigin: "USA",
  },
  {
    id: "4",
    name: "Premier Services",
    contract: "GS-10F-0789W",
    products: 2100,
    sin: "561210",
    contractingOfficer: "Robert Chen",
    coId: "RC-4782",
    gsaAddress: "1500 East Woodfield Road",
    gsaCity: "Schaumburg, IL 60173",
    consultant: "John Smith",
    consultantPhone: "(703) 555-0142",
    consultantEmail: "jsmith@winvale.com",
    authNegotiator: "Jennifer Brown",
    authTitle: "President",
    gsaDiscount: "15%",
    volumeDiscount: "4%",
    deliveryNormal: "30 days ARO",
    deliveryExpedited: "14 days ARO",
    fobTerms: "Destination",
    countryOfOrigin: "USA",
  },
];

// Mock analysis results
const mockResults = {
  additions: [
    {
      partNumber: "SKU-2024-001",
      productName: "Enterprise Cloud Server Pro",
      gsaPrice: "$12,499.00",
      commercialPrice: "$14,999.00",
      discount: "16.67%",
    },
    {
      partNumber: "SKU-2024-002",
      productName: "Security Suite Premium",
      gsaPrice: "$4,999.00",
      commercialPrice: "$5,999.00",
      discount: "16.67%",
    },
    {
      partNumber: "SKU-2024-003",
      productName: "Data Analytics Platform",
      gsaPrice: "$8,750.00",
      commercialPrice: "$10,500.00",
      discount: "16.67%",
    },
    {
      partNumber: "SKU-2024-004",
      productName: "Cloud Storage 10TB",
      gsaPrice: "$2,499.00",
      commercialPrice: "$2,999.00",
      discount: "16.67%",
    },
    {
      partNumber: "SKU-2024-005",
      productName: "Network Monitor Pro",
      gsaPrice: "$1,875.00",
      commercialPrice: "$2,250.00",
      discount: "16.67%",
    },
  ],
  deletions: [
    {
      partNumber: "SKU-2019-101",
      productName: "Legacy Server Basic (Discontinued)",
      gsaPrice: "$5,999.00",
      reason: "Product discontinued",
    },
    {
      partNumber: "SKU-2019-102",
      productName: "Old Analytics Tool",
      gsaPrice: "$2,499.00",
      reason: "Replaced by new version",
    },
    {
      partNumber: "SKU-2020-201",
      productName: "Basic Storage 1TB",
      gsaPrice: "$499.00",
      reason: "No longer offered",
    },
  ],
  priceIncreases: [
    {
      partNumber: "SKU-2022-301",
      productName: "Premium Support Package",
      oldPrice: "$1,999.00",
      newPrice: "$2,199.00",
      change: "+10.0%",
    },
    {
      partNumber: "SKU-2022-302",
      productName: "Advanced Training Module",
      oldPrice: "$4,500.00",
      newPrice: "$4,950.00",
      change: "+10.0%",
    },
    {
      partNumber: "SKU-2021-401",
      productName: "Enterprise License",
      oldPrice: "$24,999.00",
      newPrice: "$27,499.00",
      change: "+10.0%",
    },
    {
      partNumber: "SKU-2021-402",
      productName: "Pro License Bundle",
      oldPrice: "$9,999.00",
      newPrice: "$10,999.00",
      change: "+10.0%",
    },
  ],
  priceDecreases: [
    {
      partNumber: "SKU-2023-501",
      productName: "Basic Software License",
      oldPrice: "$999.00",
      newPrice: "$799.00",
      change: "-20.0%",
    },
    {
      partNumber: "SKU-2023-502",
      productName: "Standard Maintenance",
      oldPrice: "$2,500.00",
      newPrice: "$2,000.00",
      change: "-20.0%",
    },
  ],
  descriptionChanges: [
    {
      partNumber: "SKU-2022-601",
      productName: "Cloud Backup Service",
      oldDescription: "Basic cloud backup with 100GB storage",
      newDescription: "Enhanced cloud backup with 500GB storage and encryption",
      gsaPrice: "$149.00",
    },
    {
      partNumber: "SKU-2022-602",
      productName: "Security Monitoring",
      oldDescription: "24/5 monitoring service",
      newDescription: "24/7 monitoring service with AI threat detection",
      gsaPrice: "$599.00",
    },
  ],
};

const steps = [
  { id: 1, title: "Select Client", description: "Choose a client or contract" },
  {
    id: 2,
    title: "Upload Pricelist",
    description: "Upload commercial pricelist",
  },
  { id: 3, title: "Run Analysis", description: "Process and compare data" },
  { id: 4, title: "Review Results", description: "Review and export results" },
];

export default function PriceListAnalysis() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("additions");

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async (): Promise<void> => {
    try {
      setLoadingClients(true);
      const response = await api.get<Client[]>("clients/approved");
      setClients(response.data);
    } catch {
      setError("Failed to load approved clients");
    } finally {
      setLoadingClients(false);
    }
  };

  const handleFileUpload = () => {
    setUploadedFile("commercial_pricelist_2024.xlsx");
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          setCurrentStep(4);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden transition-all duration-500 hover:border-slate-300/80">
            {/* Header Section */}
            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2.5 bg-cyan-50 rounded-xl shadow-sm ring-1 ring-cyan-100">
                  <Building2 className="w-5 h-5 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                  Select Client or Contract
                </h3>
              </div>
              <p className="text-[14px] text-slate-500  leading-relaxed">
                Choose the client whose pricelist you want to analyze
              </p>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Client / Contract
                </label>

                {loadingClients ? (
                  <div className="flex items-center gap-3 p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl h-[60px]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#3399cc]" />
                    <span className="text-slate-400 text-sm font-medium italic">
                      Fetching approved clients...
                    </span>
                  </div>
                ) : (
                  <div className="relative group/select mt-2">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/select:text-[#3399cc] transition-colors duration-300"
                      size={18}
                    />
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all duration-300 text-slate-700 appearance-none font-medium cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300"
                    >
                      <option value="" className="text-slate-400">
                        -- Choose an approved client --
                      </option>
                      {clients.map((client) => (
                        <option>
                          {client.company_name}
                          {client.contract_number
                            ? ` (${client.contract_number})`
                            : " (No contract)"}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within/select:rotate-180 transition-transform duration-300">
                      <ChevronDownIcon className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedClient}
                  className="group/btn px-10 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold flex items-center gap-2 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/30 active:scale-[0.98]"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-500" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Upload Commercial Pricelist
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Upload the updated commercial pricelist (Excel format)
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                  uploadedFile
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/50"
                }`}
                onClick={handleFileUpload}
              >
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {uploadedFile}
                      </p>
                      <p className="text-sm text-slate-500">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-slate-500">
                        Excel files (.xlsx, .xls) up to 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 h-11 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!uploadedFile}
                  className="px-6 h-11 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Run Analysis
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Compare the uploaded pricelist with the existing GSA contract
                data
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Client</p>
                    <p className="font-medium text-slate-900">
                      {mockClients.find((c) => c.id === selectedClient)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Contract</p>
                    <p className="font-medium text-slate-900">
                      {
                        mockClients.find((c) => c.id === selectedClient)
                          ?.contract
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Uploaded File</p>
                    <p className="font-medium text-slate-900">{uploadedFile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Current Products
                    </p>
                    <p className="font-medium text-slate-900">
                      {mockClients
                        .find((c) => c.id === selectedClient)
                        ?.products.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Analyzing pricelist...
                    </span>
                    <span className="font-medium text-slate-900">
                      {analysisProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Comparing{" "}
                    {mockClients
                      .find((c) => c.id === selectedClient)
                      ?.products.toLocaleString()}{" "}
                    products...
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={isAnalyzing}
                  className="px-6 h-11 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 h-11 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div
                onClick={() => setActiveTab("additions")}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {mockResults.additions.length}
                    </p>
                    <p className="text-xs text-slate-500">Additions</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setActiveTab("deletions")}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <Minus className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {mockResults.deletions.length}
                    </p>
                    <p className="text-xs text-slate-500">Deletions</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setActiveTab("priceIncreases")}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {mockResults.priceIncreases.length}
                    </p>
                    <p className="text-xs text-slate-500">Increases</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setActiveTab("priceDecreases")}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {mockResults.priceDecreases.length}
                    </p>
                    <p className="text-xs text-slate-500">Decreases</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setActiveTab("descriptionChanges")}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileEdit className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {mockResults.descriptionChanges.length}
                    </p>
                    <p className="text-xs text-slate-500">Desc. Changes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Analysis Results
                  </h3>
                  <div className="flex gap-2">
                    <button className="px-4 h-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-2 transition-colors">
                      <FileText className="w-4 h-4" />
                      Generate Cover Letter
                    </button>
                    <button className="px-4 h-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" />
                      Export All
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {/* Tab Headers */}
                <div className="grid grid-cols-5 gap-2 mb-4 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setActiveTab("additions")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "additions"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    Additions
                  </button>
                  <button
                    onClick={() => setActiveTab("deletions")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "deletions"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Minus className="w-3 h-3 text-red-600" />
                    Deletions
                  </button>
                  <button
                    onClick={() => setActiveTab("priceIncreases")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "priceIncreases"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 text-amber-600" />
                    Increases
                  </button>
                  <button
                    onClick={() => setActiveTab("priceDecreases")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "priceDecreases"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <TrendingDown className="w-3 h-3 text-cyan-600" />
                    Decreases
                  </button>
                  <button
                    onClick={() => setActiveTab("descriptionChanges")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "descriptionChanges"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileEdit className="w-3 h-3 text-blue-600" />
                    Descriptions
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "additions" && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Part Number
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Product Name
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            GSA Price
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            Commercial Price
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            Discount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.additions.map((item, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-200 hover:bg-slate-50"
                          >
                            <td className="p-3 font-mono text-xs text-slate-600">
                              {item.partNumber}
                            </td>
                            <td className="p-3 text-slate-900">
                              {item.productName}
                            </td>
                            <td className="p-3 text-right font-medium text-slate-900">
                              {item.gsaPrice}
                            </td>
                            <td className="p-3 text-right text-slate-500">
                              {item.commercialPrice}
                            </td>
                            <td className="p-3 text-right">
                              <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                                {item.discount}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "deletions" && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Part Number
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Product Name
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            GSA Price
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.deletions.map((item, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-200 hover:bg-slate-50"
                          >
                            <td className="p-3 font-mono text-xs text-slate-600">
                              {item.partNumber}
                            </td>
                            <td className="p-3 text-slate-900">
                              {item.productName}
                            </td>
                            <td className="p-3 text-right font-medium text-slate-900">
                              {item.gsaPrice}
                            </td>
                            <td className="p-3 text-slate-500">
                              {item.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "priceIncreases" && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Part Number
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Product Name
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            Old Price
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            New Price
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            Change
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.priceIncreases.map((item, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-200 hover:bg-slate-50"
                          >
                            <td className="p-3 font-mono text-xs text-slate-600">
                              {item.partNumber}
                            </td>
                            <td className="p-3 text-slate-900">
                              {item.productName}
                            </td>
                            <td className="p-3 text-right text-slate-500">
                              {item.oldPrice}
                            </td>
                            <td className="p-3 text-right font-medium text-slate-900">
                              {item.newPrice}
                            </td>
                            <td className="p-3 text-right">
                              <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                                {item.change}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "priceDecreases" && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Part Number
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Product Name
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            Old Price
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            New Price
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            Change
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.priceDecreases.map((item, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-200 hover:bg-slate-50"
                          >
                            <td className="p-3 font-mono text-xs text-slate-600">
                              {item.partNumber}
                            </td>
                            <td className="p-3 text-slate-900">
                              {item.productName}
                            </td>
                            <td className="p-3 text-right text-slate-500">
                              {item.oldPrice}
                            </td>
                            <td className="p-3 text-right font-medium text-slate-900">
                              {item.newPrice}
                            </td>
                            <td className="p-3 text-right">
                              <span className="px-2 py-1 rounded-md bg-cyan-50 text-cyan-700 text-xs font-medium">
                                {item.change}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "descriptionChanges" && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Part Number
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Product Name
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            Old Description
                          </th>
                          <th className="text-left p-3 font-medium text-slate-700">
                            New Description
                          </th>
                          <th className="text-right p-3 font-medium text-slate-700">
                            GSA Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.descriptionChanges.map((item, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-200 hover:bg-slate-50"
                          >
                            <td className="p-3 font-mono text-xs text-slate-600">
                              {item.partNumber}
                            </td>
                            <td className="p-3 text-slate-900">
                              {item.productName}
                            </td>
                            <td className="p-3 text-slate-500 text-xs">
                              {item.oldDescription}
                            </td>
                            <td className="p-3 text-slate-900 text-xs">
                              {item.newDescription}
                            </td>
                            <td className="p-3 text-right font-medium text-slate-900">
                              {item.gsaPrice}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedClient("");
                  setUploadedFile(null);
                  setAnalysisComplete(false);
                  setAnalysisProgress(0);
                }}
                className="px-6 h-11 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                Start New Analysis
              </button>
              <button className="px-6 h-11 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium flex items-center gap-2 transition-colors">
                <FileText className="w-4 h-4" />
                Generate All Documents
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Price List Analysis
        </h1>
        <p className="text-slate-500 font-medium">
          Compare commercial pricelists with GSA contract data
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`h-10 px-4 flex items-center gap-3 rounded-3xl transition-all duration-500 ${
                currentStep === step.id
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 scale-105"
                  : "text-slate-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  currentStep === step.id
                    ? "border-white/30 bg-white/10"
                    : "border-slate-200"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-3 h-3" />
                ) : (
                  step.id
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold uppercase tracking-widest leading-none">
                  {step.title}
                </p>
              </div>
            </div>
            {step.id < 4 && <div className="w-4 h-px bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full">{renderStepContent()}</div>
    </div>
  );
}
