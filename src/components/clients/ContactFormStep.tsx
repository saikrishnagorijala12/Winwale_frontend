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
  const inputClass =
    "w-full bg-white mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 transition-colors focus:outline-none focus:border-[#38A1DB]";

  const handleNegotiatorChange = (
    index: number,
    field: keyof Negotiator,
    value: string,
  ) => {
    const updatedNegotiators = [...formData.negotiators];
    updatedNegotiators[index] = {
      ...updatedNegotiators[index],
      [field]: value,
    };
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
      const updatedNegotiators = formData.negotiators.filter(
        (_, i) => i !== index,
      );
      onChange("negotiators", updatedNegotiators);
    }
  };

  return (
    <div className="space-y-8">
      {formData.negotiators.map((negotiator, index) => {
        const negErrors = errors.negotiators?.[index] || {};
        
        return (
          <div
            key={index}
            className={`p-6 bg-slate-50/50 rounded-2xl border transition-colors relative group ${
              Object.keys(negErrors).length > 0 ? "border-red-200 bg-red-50/10" : "border-slate-100"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
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

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Negotiator Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`${inputClass} ${negErrors.name ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.name}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "name", e.target.value)
                    }
                  />
                  {negErrors.name && (
                    <p className="mt-1 text-xs text-red-600">{negErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`${inputClass} ${negErrors.title ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.title}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "title", e.target.value)
                    }
                  />
                  {negErrors.title && (
                    <p className="mt-1 text-xs text-red-600">{negErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className={`${inputClass} ${negErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.email || ""}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "email", e.target.value)
                    }
                  />
                  {negErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{negErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`${inputClass} ${negErrors.phone_no ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.phone_no || ""}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "phone_no", e.target.value)
                    }
                  />
                  {negErrors.phone_no && (
                    <p className="mt-1 text-xs text-red-600">{negErrors.phone_no}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Address
                  </label>
                  <input
                    type="text"
                    className={`${inputClass} ${negErrors.address ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.address || ""}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "address", e.target.value)
                    }
                  />
                  {negErrors.address && (
                    <p className="mt-1 text-xs text-red-600">
                      {negErrors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    className={`${inputClass} ${negErrors.city ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.city || ""}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "city", e.target.value)
                    }
                  />
                  {negErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{negErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    State
                  </label>
                  <input
                    type="text"
                    className={`${inputClass} ${negErrors.state ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.state || ""}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "state", e.target.value)
                    }
                  />
                  {negErrors.state && (
                    <p className="mt-1 text-xs text-red-600">
                      {negErrors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">ZIP</label>
                  <input
                    type="text"
                    className={`${inputClass} ${negErrors.zip ? "border-red-500 focus:border-red-500" : ""}`}
                    value={negotiator.zip || ""}
                    onChange={(e) =>
                      handleNegotiatorChange(index, "zip", e.target.value)
                    }
                  />
                  {negErrors.zip && (
                    <p className="mt-1 text-xs text-red-600">{negErrors.zip}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addNegotiator}
        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-[#38A1DB] hover:text-[#38A1DB] transition-all flex items-center justify-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Add Another Negotiator
      </button>
    </div>
  );
};
