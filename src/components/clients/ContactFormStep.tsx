import { Plus, Trash2 } from "lucide-react";
import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
  Negotiator,
} from "../../types/client.types";

interface ContactFormStepProps {
  formData: ClientFormData | EditingClient;
  onChange: (field: keyof ClientFormData, value: any) => void;
  errors: ClientFormErrors;
  onClearError: (field: keyof ClientFormErrors) => void;
}

export const ContactFormStep: React.FC<ContactFormStepProps> = ({
  formData,
  onChange,
  errors,
  onClearError,
}) => {
  const inputClass = (field: string) =>
    `w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none border-slate-200 focus:border-[#38A1DB]`;

  const handleNegotiatorChange = (
    index: number,
    field: keyof Negotiator,
    value: string
  ) => {
    const updatedNegotiators = [...formData.negotiators];
    updatedNegotiators[index] = { ...updatedNegotiators[index], [field]: value };
    onChange("negotiators", updatedNegotiators);
    onClearError("negotiators");
  };

  const addNegotiator = () => {
    onChange("negotiators", [
      ...formData.negotiators,
      {
        name: "",
        title: "",
        email: "",
        phone_no: "",
        address: "",
        city: "",
        state: "",
        zip: "",
      },
    ]);
  };

  const removeNegotiator = (index: number) => {
    if (formData.negotiators.length > 1) {
      const updatedNegotiators = formData.negotiators.filter((_, i) => i !== index);
      onChange("negotiators", updatedNegotiators);
    }
  };

  return (
    <div className="space-y-8">
      {formData.negotiators.map((negotiator, index) => (
        <div key={index} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Negotiator {index + 1}
            </h3>
            {formData.negotiators.length > 1 && (
              <button
                type="button"
                onClick={() => removeNegotiator(index)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                Negotiator Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={inputClass("name")}
                value={negotiator.name}
                onChange={(e) => handleNegotiatorChange(index, "name", e.target.value)}
              />
              {errors.negotiators?.[index]?.name && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={inputClass("title")}
                value={negotiator.title}
                onChange={(e) => handleNegotiatorChange(index, "title", e.target.value)}
              />
              {errors.negotiators?.[index]?.title && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].title}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={inputClass("email")}
                value={negotiator.email || ""}
                onChange={(e) => handleNegotiatorChange(index, "email", e.target.value)}
              />
              {errors.negotiators?.[index]?.email && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className={inputClass("phone_no")}
                value={negotiator.phone_no || ""}
                onChange={(e) => handleNegotiatorChange(index, "phone_no", e.target.value)}
              />
              {errors.negotiators?.[index]?.phone_no && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].phone_no}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Address</label>
              <input
                type="text"
                className={inputClass("address")}
                value={negotiator.address || ""}
                onChange={(e) => handleNegotiatorChange(index, "address", e.target.value)}
              />
              {errors.negotiators?.[index]?.address && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].address}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">City</label>
              <input
                type="text"
                className={inputClass("city")}
                value={negotiator.city || ""}
                onChange={(e) => handleNegotiatorChange(index, "city", e.target.value)}
              />
              {errors.negotiators?.[index]?.city && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].city}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">State</label>
              <input
                type="text"
                className={inputClass("state")}
                value={negotiator.state || ""}
                onChange={(e) => handleNegotiatorChange(index, "state", e.target.value)}
              />
              {errors.negotiators?.[index]?.state && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].state}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">ZIP</label>
              <input
                type="text"
                className={inputClass("zip")}
                value={negotiator.zip || ""}
                onChange={(e) => handleNegotiatorChange(index, "zip", e.target.value)}
              />
              {errors.negotiators?.[index]?.zip && (
                <p className="mt-1 text-xs text-red-600">{errors.negotiators[index].zip}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addNegotiator}
        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-[#38A1DB] hover:text-[#38A1DB] transition-all flex items-center justify-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Add Another Negotiator
      </button>
    </div>
  );
};
