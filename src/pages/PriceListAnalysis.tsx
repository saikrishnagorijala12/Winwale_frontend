// import { useState } from 'react';
// import { 
//   Plus, 
//   Minus, 
//   TrendingUp, 
//   TrendingDown, 
//   FileEdit,
//   FileText,
//   Download,
//   Upload,
//   Play,
//   ChevronRight,
//   ChevronLeft,
//   Check,
//   Building2,
//   FileSpreadsheet,
//   Sparkles,
//   ArrowRight,
//   Eye
// } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { Progress } from '@/components/ui/progress';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import { CoverLetterPreviewModal } from '@/components/CoverLetterPreviewModal';

// // Mock data for clients with full contract details
// const mockClients = [
//   { 
//     id: '1', 
//     name: 'Acme Corp', 
//     contract: 'GS-35F-0001Y', 
//     products: 1250,
//     sin: '54151S, 54151HEAL',
//     contractingOfficer: 'Maria Garcia',
//     coId: 'MG-2847',
//     gsaAddress: '1800 F Street NW',
//     gsaCity: 'Washington, DC 20405',
//     consultant: 'John Smith',
//     consultantPhone: '(703) 555-0142',
//     consultantEmail: 'jsmith@winvale.com',
//     authNegotiator: 'Robert Chen',
//     authTitle: 'VP of Federal Sales',
//     gsaDiscount: '20%',
//     volumeDiscount: '5%',
//     deliveryNormal: '30 days ARO',
//     deliveryExpedited: '15 days ARO',
//     fobTerms: 'Destination',
//     countryOfOrigin: 'USA',
//   },
//   { 
//     id: '2', 
//     name: 'TechVentures Inc', 
//     contract: 'GS-07F-0123X', 
//     products: 3400,
//     sin: '33411, 334111',
//     contractingOfficer: 'James Anderson',
//     coId: 'JA-1923',
//     gsaAddress: '10304 Eaton Place',
//     gsaCity: 'Fairfax, VA 22030',
//     consultant: 'Sarah Johnson',
//     consultantPhone: '(703) 555-0198',
//     consultantEmail: 'sjohnson@winvale.com',
//     authNegotiator: 'Emily Wilson',
//     authTitle: 'Director of Government Contracts',
//     gsaDiscount: '18%',
//     volumeDiscount: '3%',
//     deliveryNormal: '45 days ARO',
//     deliveryExpedited: '20 days ARO',
//     fobTerms: 'Destination',
//     countryOfOrigin: 'USA',
//   },
//   { 
//     id: '3', 
//     name: 'Global Solutions', 
//     contract: 'GS-00F-0456Z', 
//     products: 890,
//     sin: '541611',
//     contractingOfficer: 'Patricia Martinez',
//     coId: 'PM-3651',
//     gsaAddress: '2200 Crystal Drive',
//     gsaCity: 'Arlington, VA 22202',
//     consultant: 'Mike Chen',
//     consultantPhone: '(703) 555-0167',
//     consultantEmail: 'mchen@winvale.com',
//     authNegotiator: 'David Lee',
//     authTitle: 'CEO',
//     gsaDiscount: '22%',
//     volumeDiscount: '7%',
//     deliveryNormal: '21 days ARO',
//     deliveryExpedited: '10 days ARO',
//     fobTerms: 'Origin',
//     countryOfOrigin: 'USA',
//   },
//   { 
//     id: '4', 
//     name: 'Premier Services', 
//     contract: 'GS-10F-0789W', 
//     products: 2100,
//     sin: '561210',
//     contractingOfficer: 'Robert Chen',
//     coId: 'RC-4782',
//     gsaAddress: '1500 East Woodfield Road',
//     gsaCity: 'Schaumburg, IL 60173',
//     consultant: 'John Smith',
//     consultantPhone: '(703) 555-0142',
//     consultantEmail: 'jsmith@winvale.com',
//     authNegotiator: 'Jennifer Brown',
//     authTitle: 'President',
//     gsaDiscount: '15%',
//     volumeDiscount: '4%',
//     deliveryNormal: '30 days ARO',
//     deliveryExpedited: '14 days ARO',
//     fobTerms: 'Destination',
//     countryOfOrigin: 'USA',
//   },
// ];

// // Mock analysis results
// const mockResults = {
//   additions: [
//     { partNumber: 'SKU-2024-001', productName: 'Enterprise Cloud Server Pro', gsaPrice: '$12,499.00', commercialPrice: '$14,999.00', discount: '16.67%' },
//     { partNumber: 'SKU-2024-002', productName: 'Security Suite Premium', gsaPrice: '$4,999.00', commercialPrice: '$5,999.00', discount: '16.67%' },
//     { partNumber: 'SKU-2024-003', productName: 'Data Analytics Platform', gsaPrice: '$8,750.00', commercialPrice: '$10,500.00', discount: '16.67%' },
//     { partNumber: 'SKU-2024-004', productName: 'Cloud Storage 10TB', gsaPrice: '$2,499.00', commercialPrice: '$2,999.00', discount: '16.67%' },
//     { partNumber: 'SKU-2024-005', productName: 'Network Monitor Pro', gsaPrice: '$1,875.00', commercialPrice: '$2,250.00', discount: '16.67%' },
//   ],
//   deletions: [
//     { partNumber: 'SKU-2019-101', productName: 'Legacy Server Basic (Discontinued)', gsaPrice: '$5,999.00', reason: 'Product discontinued' },
//     { partNumber: 'SKU-2019-102', productName: 'Old Analytics Tool', gsaPrice: '$2,499.00', reason: 'Replaced by new version' },
//     { partNumber: 'SKU-2020-201', productName: 'Basic Storage 1TB', gsaPrice: '$499.00', reason: 'No longer offered' },
//   ],
//   priceIncreases: [
//     { partNumber: 'SKU-2022-301', productName: 'Premium Support Package', oldPrice: '$1,999.00', newPrice: '$2,199.00', change: '+10.0%' },
//     { partNumber: 'SKU-2022-302', productName: 'Advanced Training Module', oldPrice: '$4,500.00', newPrice: '$4,950.00', change: '+10.0%' },
//     { partNumber: 'SKU-2021-401', productName: 'Enterprise License', oldPrice: '$24,999.00', newPrice: '$27,499.00', change: '+10.0%' },
//     { partNumber: 'SKU-2021-402', productName: 'Pro License Bundle', oldPrice: '$9,999.00', newPrice: '$10,999.00', change: '+10.0%' },
//   ],
//   priceDecreases: [
//     { partNumber: 'SKU-2023-501', productName: 'Basic Software License', oldPrice: '$999.00', newPrice: '$799.00', change: '-20.0%' },
//     { partNumber: 'SKU-2023-502', productName: 'Standard Maintenance', oldPrice: '$2,500.00', newPrice: '$2,000.00', change: '-20.0%' },
//   ],
//   descriptionChanges: [
//     { partNumber: 'SKU-2022-601', productName: 'Cloud Backup Service', oldDescription: 'Basic cloud backup with 100GB storage', newDescription: 'Enhanced cloud backup with 500GB storage and encryption', gsaPrice: '$149.00' },
//     { partNumber: 'SKU-2022-602', productName: 'Security Monitoring', oldDescription: '24/5 monitoring service', newDescription: '24/7 monitoring service with AI threat detection', gsaPrice: '$599.00' },
//   ],
// };

// const steps = [
//   { id: 1, title: 'Select Client', description: 'Choose a client or contract' },
//   { id: 2, title: 'Upload Pricelist', description: 'Upload commercial pricelist' },
//   { id: 3, title: 'Run Analysis', description: 'Process and compare data' },
//   { id: 4, title: 'Review Results', description: 'Review and export results' },
// ];

// export default function PriceListAnalysis() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedClient, setSelectedClient] = useState<string>('');
//   const [uploadedFile, setUploadedFile] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisProgress, setAnalysisProgress] = useState(0);
//   const [analysisComplete, setAnalysisComplete] = useState(false);
//   const [activeTab, setActiveTab] = useState('additions');
//   const [coverLetterOpen, setCoverLetterOpen] = useState(false);

//   const handleFileUpload = () => {
//     // Simulate file selection
//     setUploadedFile('commercial_pricelist_2024.xlsx');
//     toast.success('File uploaded successfully');
//   };

//   const handleRunAnalysis = async () => {
//     setIsAnalyzing(true);
//     setAnalysisProgress(0);

//     // Simulate analysis progress
//     const interval = setInterval(() => {
//       setAnalysisProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setIsAnalyzing(false);
//           setAnalysisComplete(true);
//           setCurrentStep(4);
//           toast.success('Analysis completed successfully!');
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 300);
//   };

//   const handleDownload = (type: string) => {
//     toast.success(`Downloading ${type} as Excel file...`);
//   };

//   const handleGenerateCoverLetter = () => {
//     setCoverLetterOpen(true);
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <Card className="animate-fade-in glass-card border-0 shadow-soft rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Building2 className="w-5 h-5 text-accent" />
//                 Select Client or Contract
//               </CardTitle>
//               <CardDescription>
//                 Choose the client whose pricelist you want to analyze
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 <Label>Client / Contract</Label>
//                 <Select value={selectedClient} onValueChange={setSelectedClient}>
//                   <SelectTrigger className="h-12">
//                     <SelectValue placeholder="Select a client..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {mockClients.map(client => (
//                       <SelectItem key={client.id} value={client.id}>
//                         <div className="flex items-center gap-3">
//                           <span className="font-medium">{client.name}</span>
//                           <span className="text-muted-foreground text-sm">({client.contract})</span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* {selectedClient && (
//                 <div className="p-4 rounded-lg bg-muted/50 border border-border animate-fade-in">
//                   <p className="text-sm font-medium text-foreground mb-2">Contract Details</p>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Contract Number:</span>
//                       <p className="font-medium">{mockClients.find(c => c.id === selectedClient)?.contract}</p>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Current Products:</span>
//                       <p className="font-medium">{mockClients.find(c => c.id === selectedClient)?.products.toLocaleString()}</p>
//                     </div>
//                   </div>
//                 </div>
//               )} */}

//               <div className="flex justify-end">
//                 <Button 
//                   onClick={() => setCurrentStep(2)} 
//                   disabled={!selectedClient}
//                   className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
//                 >
//                   Continue
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       case 2:
//         return (
//           <Card className="animate-fade-in glass-card border-0 shadow-soft rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileSpreadsheet className="w-5 h-5 text-accent" />
//                 Upload Commercial Pricelist
//               </CardTitle>
//               <CardDescription>
//                 Upload the updated commercial pricelist (Excel format)
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div 
//                 className={cn(
//                   "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
//                   uploadedFile ? "border-success bg-success/5" : "border-border hover:border-accent hover:bg-accent/5"
//                 )}
//                 onClick={handleFileUpload}
//               >
//                 {uploadedFile ? (
//                   <div className="space-y-3">
//                     <div className="w-16 h-16 mx-auto rounded-xl bg-success/10 flex items-center justify-center">
//                       <Check className="w-8 h-8 text-success" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-foreground">{uploadedFile}</p>
//                       <p className="text-sm text-muted-foreground">Click to replace</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="w-16 h-16 mx-auto rounded-xl bg-muted flex items-center justify-center">
//                       <Upload className="w-8 h-8 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-foreground">Click to upload or drag and drop</p>
//                       <p className="text-sm text-muted-foreground">Excel files (.xlsx, .xls) up to 50MB</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => setCurrentStep(1)}>
//                   <ChevronLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//                 <Button 
//                   onClick={() => setCurrentStep(3)} 
//                   disabled={!uploadedFile}
//                   className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
//                 >
//                   Continue
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       case 3:
//         return (
//           <Card className="animate-fade-in glass-card border-0 shadow-soft rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Sparkles className="w-5 h-5 text-accent" />
//                 Run Analysis
//               </CardTitle>
//               <CardDescription>
//                 Compare the uploaded pricelist with the existing GSA contract data
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="p-6 rounded-xl bg-muted/50 border border-border">
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Client</p>
//                     <p className="font-medium">{mockClients.find(c => c.id === selectedClient)?.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Contract</p>
//                     <p className="font-medium">{mockClients.find(c => c.id === selectedClient)?.contract}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Uploaded File</p>
//                     <p className="font-medium">{uploadedFile}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Current Products</p>
//                     <p className="font-medium">{mockClients.find(c => c.id === selectedClient)?.products.toLocaleString()}</p>
//                   </div>
//                 </div>
//               </div>

//               {isAnalyzing && (
//                 <div className="space-y-4 animate-fade-in">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Analyzing pricelist...</span>
//                     <span className="font-medium">{analysisProgress}%</span>
//                   </div>
//                   <Progress value={analysisProgress} className="h-2" />
//                   <p className="text-xs text-muted-foreground text-center">
//                     Comparing {mockClients.find(c => c.id === selectedClient)?.products.toLocaleString()} products...
//                   </p>
//                 </div>
//               )}

//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isAnalyzing}>
//                   <ChevronLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//                 <Button 
//                   onClick={handleRunAnalysis} 
//                   disabled={isAnalyzing}
//                   className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
//                 >
//                   {isAnalyzing ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
//                       Analyzing...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="w-4 h-4" />
//                       Run Analysis
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         );

//       case 4:
//         return (
//           <div className="space-y-6 animate-fade-in ">
//             {/* Results Summary */}
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//               <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow glass-card border-0 shadow-soft rounded-2xl" onClick={() => setActiveTab('additions')}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
//                     <Plus className="w-5 h-5 text-success" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-foreground">{mockResults.additions.length}</p>
//                     <p className="text-xs text-muted-foreground">Additions</p>
//                   </div>
//                 </div>
//               </Card>
//               <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow glass-card border-0 shadow-soft rounded-2xl" onClick={() => setActiveTab('deletions')}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
//                     <Minus className="w-5 h-5 text-destructive" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-foreground">{mockResults.deletions.length}</p>
//                     <p className="text-xs text-muted-foreground">Deletions</p>
//                   </div>
//                 </div>
//               </Card>
//               <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow glass-card border-0 shadow-soft rounded-2xl" onClick={() => setActiveTab('priceIncreases')}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
//                     <TrendingUp className="w-5 h-5 text-warning" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-foreground">{mockResults.priceIncreases.length}</p>
//                     <p className="text-xs text-muted-foreground">Increases</p>
//                   </div>
//                 </div>
//               </Card>
//               <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow glass-card border-0 shadow-soft rounded-2xl" onClick={() => setActiveTab('priceDecreases')}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
//                     <TrendingDown className="w-5 h-5 text-accent" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-foreground">{mockResults.priceDecreases.length}</p>
//                     <p className="text-xs text-muted-foreground">Decreases</p>
//                   </div>
//                 </div>
//               </Card>
//               <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow glass-card border-0 shadow-soft rounded-2xl" onClick={() => setActiveTab('descriptionChanges')}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                     <FileEdit className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold text-foreground">{mockResults.descriptionChanges.length}</p>
//                     <p className="text-xs text-muted-foreground">Desc. Changes</p>
//                   </div>
//                 </div>
//               </Card>
//             </div>

//             {/* Results Tabs */}
//             <Card className='glass-card border-0 shadow-soft rounded-3xl'>
//               <CardHeader className="pb-0">
//                 <div className="flex items-center justify-between">
//                   <CardTitle>Analysis Results</CardTitle>
//                   <div className="flex gap-2">
//                     <Button variant="outline" size="sm" onClick={handleGenerateCoverLetter}>
//                       <FileText className="w-4 h-4 mr-2" />
//                       Generate Cover Letter
//                     </Button>
//                     <Button variant="outline" size="sm" onClick={() => handleDownload('all')}>
//                       <Download className="w-4 h-4 mr-2" />
//                       Export All
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-4">
//                 <Tabs value={activeTab} onValueChange={setActiveTab}>
//                   <TabsList className="grid w-full grid-cols-5 mb-4">
//                     <TabsTrigger value="additions" className="gap-2">
//                       <Plus className="w-3 h-3 text-success" />
//                       Additions
//                     </TabsTrigger>
//                     <TabsTrigger value="deletions" className="gap-2">
//                       <Minus className="w-3 h-3 text-destructive" />
//                       Deletions
//                     </TabsTrigger>
//                     <TabsTrigger value="priceIncreases" className="gap-2">
//                       <TrendingUp className="w-3 h-3 text-warning" />
//                       Increases
//                     </TabsTrigger>
//                     <TabsTrigger value="priceDecreases" className="gap-2">
//                       <TrendingDown className="w-3 h-3 text-accent" />
//                       Decreases
//                     </TabsTrigger>
//                     <TabsTrigger value="descriptionChanges" className="gap-2">
//                       <FileEdit className="w-3 h-3 text-primary" />
//                       Descriptions
//                     </TabsTrigger>
//                   </TabsList>

//                   <TabsContent value="additions" className="space-y-4">
//                     {/* <div className="flex justify-end">
//                       <Button variant="outline" size="sm" onClick={() => handleDownload('additions')}>
//                         <Download className="w-4 h-4 mr-2" />
//                         Download Excel
//                       </Button>
//                     </div> */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <table className="w-full text-sm">
//                         <thead className="bg-muted">
//                           <tr>
//                             <th className="text-left p-3 font-medium">Part Number</th>
//                             <th className="text-left p-3 font-medium">Product Name</th>
//                             <th className="text-right p-3 font-medium">GSA Price</th>
//                             <th className="text-right p-3 font-medium">Commercial Price</th>
//                             <th className="text-right p-3 font-medium">Discount</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {mockResults.additions.map((item, i) => (
//                             <tr key={i} className="border-t hover:bg-muted/50">
//                               <td className="p-3 font-mono text-xs">{item.partNumber}</td>
//                               <td className="p-3">{item.productName}</td>
//                               <td className="p-3 text-right font-medium">{item.gsaPrice}</td>
//                               <td className="p-3 text-right text-muted-foreground">{item.commercialPrice}</td>
//                               <td className="p-3 text-right">
//                                 <Badge variant="secondary" className="bg-success/10 text-success">
//                                   {item.discount}
//                                 </Badge>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="deletions" className="space-y-4">
//                     {/* <div className="flex justify-end">
//                       <Button variant="outline" size="sm" onClick={() => handleDownload('deletions')}>
//                         <Download className="w-4 h-4 mr-2" />
//                         Download Excel
//                       </Button>
//                     </div> */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <table className="w-full text-sm">
//                         <thead className="bg-muted">
//                           <tr>
//                             <th className="text-left p-3 font-medium">Part Number</th>
//                             <th className="text-left p-3 font-medium">Product Name</th>
//                             <th className="text-right p-3 font-medium">GSA Price</th>
//                             <th className="text-left p-3 font-medium">Reason</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {mockResults.deletions.map((item, i) => (
//                             <tr key={i} className="border-t hover:bg-muted/50">
//                               <td className="p-3 font-mono text-xs">{item.partNumber}</td>
//                               <td className="p-3">{item.productName}</td>
//                               <td className="p-3 text-right font-medium">{item.gsaPrice}</td>
//                               <td className="p-3 text-muted-foreground">{item.reason}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="priceIncreases" className="space-y-4">
//                     {/* <div className="flex justify-end">
//                       <Button variant="outline" size="sm" onClick={() => handleDownload('price-increases')}>
//                         <Download className="w-4 h-4 mr-2" />
//                         Download Excel
//                       </Button>
//                     </div> */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <table className="w-full text-sm">
//                         <thead className="bg-muted">
//                           <tr>
//                             <th className="text-left p-3 font-medium">Part Number</th>
//                             <th className="text-left p-3 font-medium">Product Name</th>
//                             <th className="text-right p-3 font-medium">Old Price</th>
//                             <th className="text-right p-3 font-medium">New Price</th>
//                             <th className="text-right p-3 font-medium">Change</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {mockResults.priceIncreases.map((item, i) => (
//                             <tr key={i} className="border-t hover:bg-muted/50">
//                               <td className="p-3 font-mono text-xs">{item.partNumber}</td>
//                               <td className="p-3">{item.productName}</td>
//                               <td className="p-3 text-right text-muted-foreground">{item.oldPrice}</td>
//                               <td className="p-3 text-right font-medium">{item.newPrice}</td>
//                               <td className="p-3 text-right">
//                                 <Badge variant="secondary" className="bg-warning/10 text-warning">
//                                   {item.change}
//                                 </Badge>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="priceDecreases" className="space-y-4">
//                     {/* <div className="flex justify-end">
//                       <Button variant="outline" size="sm" onClick={() => handleDownload('price-decreases')}>
//                         <Download className="w-4 h-4 mr-2" />
//                         Download Excel
//                       </Button>
//                     </div> */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <table className="w-full text-sm">
//                         <thead className="bg-muted">
//                           <tr>
//                             <th className="text-left p-3 font-medium">Part Number</th>
//                             <th className="text-left p-3 font-medium">Product Name</th>
//                             <th className="text-right p-3 font-medium">Old Price</th>
//                             <th className="text-right p-3 font-medium">New Price</th>
//                             <th className="text-right p-3 font-medium">Change</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {mockResults.priceDecreases.map((item, i) => (
//                             <tr key={i} className="border-t hover:bg-muted/50">
//                               <td className="p-3 font-mono text-xs">{item.partNumber}</td>
//                               <td className="p-3">{item.productName}</td>
//                               <td className="p-3 text-right text-muted-foreground">{item.oldPrice}</td>
//                               <td className="p-3 text-right font-medium">{item.newPrice}</td>
//                               <td className="p-3 text-right">
//                                 <Badge variant="secondary" className="bg-accent/10 text-accent">
//                                   {item.change}
//                                 </Badge>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="descriptionChanges" className="space-y-4">
//                     {/* <div className="flex justify-end">
//                       <Button variant="outline" size="sm" onClick={() => handleDownload('description-changes')}>
//                         <Download className="w-4 h-4 mr-2" />
//                         Download Excel
//                       </Button>
//                     </div> */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <table className="w-full text-sm">
//                         <thead className="bg-muted">
//                           <tr>
//                             <th className="text-left p-3 font-medium">Part Number</th>
//                             <th className="text-left p-3 font-medium">Product Name</th>
//                             <th className="text-left p-3 font-medium">Old Description</th>
//                             <th className="text-left p-3 font-medium">New Description</th>
//                             <th className="text-right p-3 font-medium">GSA Price</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {mockResults.descriptionChanges.map((item, i) => (
//                             <tr key={i} className="border-t hover:bg-muted/50">
//                               <td className="p-3 font-mono text-xs">{item.partNumber}</td>
//                               <td className="p-3">{item.productName}</td>
//                               <td className="p-3 text-muted-foreground text-xs">{item.oldDescription}</td>
//                               <td className="p-3 text-xs">{item.newDescription}</td>
//                               <td className="p-3 text-right font-medium">{item.gsaPrice}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>

//             {/* Actions */}
//             <div className="flex justify-between">
//               <Button 
//                 variant="outline" 
//                 onClick={() => {
//                   setCurrentStep(1);
//                   setSelectedClient('');
//                   setUploadedFile(null);
//                   setAnalysisComplete(false);
//                   setAnalysisProgress(0);
//                 }}
//               >
//                 Start New Analysis
//               </Button>
//               <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
//                 <FileText className="w-4 h-4" />
//                 Generate All Documents
//                 <ArrowRight className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const selectedClientData = mockClients.find(c => c.id === selectedClient);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="space-y-1">
//         <h1 className="text-3xl font-bold tracking-tight text-slate-900">Price List Analysis</h1>
//         <p className="text-slate-500 font-medium">
//           Compare commercial pricelists with GSA contract data
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft">
//             {steps.map((step) => (
//               <div key={step.id} className="flex items-center">
//                 <div 
//                   className={cn(
//                     "h-10 px-4 flex items-center gap-3 rounded-[1.5rem] transition-all duration-500",
//                     currentStep === step.id ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20 scale-105" : "text-slate-400"
//                   )}
//                 >
//                   <div className={cn(
//                     "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
//                     currentStep === step.id ? "border-accent-foreground/30 bg-accent-foreground/10" : "border-slate-200"
//                   )}>
//                     {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
//                   </div>
//                   <div className="hidden sm:block">
//                     <p className="text-[10px] font-bold uppercase tracking-widest leading-none">{step.title}</p>
//                   </div>
//                 </div>
//                 {step.id < 4 && <div className="w-4 h-px bg-slate-200 mx-1" />}
//               </div>
//             ))}
//       </div>

//       {/* Step Content */}
//       <div className="w-full">
//         {renderStepContent()}
//       </div>

//       {/* Cover Letter Modal */}
//       <CoverLetterPreviewModal
//         open={coverLetterOpen}
//         onOpenChange={setCoverLetterOpen}
//         contractDetails={selectedClientData || null}
//         modifications={{
//           additions: mockResults.additions.length,
//           deletions: mockResults.deletions.length,
//           priceIncreases: mockResults.priceIncreases.length,
//           priceDecreases: mockResults.priceDecreases.length,
//           descriptionChanges: mockResults.descriptionChanges.length,
//         }}
//       />
//     </div>
//   );
// }
