export const DeletionTemplate = ({ data }: { data: any }) => (
  <div className="relative text-[13px] leading-[1.6] text-foreground px-8 py-6">
    {/* Logo */}
    <div className="absolute top-6 right-8">
      <img
        src="winvale-logo.png"
        alt="Winvale"
        className="h-10 w-[140px] object-contain"
      />
    </div>

    {/* Date */}
    <p className="mb-4">[{data.submissionDate || "DATE"}]</p>

    {/* Address Block */}
    <div className="mb-4">
Attn: Jane M. Doe (CO-12345)
      <p>General Services Administration</p>
      <p>{data.gsaOfficeAddressLine}</p>
      <p>{data.gsaOfficeCityStateZip}</p>
    </div>

    {/* Subject */}
    <div className="mb-4">
      <p>
        <strong>Re:</strong> {data.companyName}
        <br />
        <strong>
          Deletion Modification to GSA Contract {data.contractNumber}
        </strong>
      </p>
    </div>
    <p className="mb-3">Dear Mr. John A. Smith</p>

    {/* Body */}
    <p className="mb-3">
      The purpose of this letter is to request your approval of a Deletion
      Modification to GSA Schedule Contract {data.contractNumber}. The
      modification consists of the deletion of{" "}
      {data.numberOfProductsDeleted || "1"} item(s) listed under SIN{" "}
      {data.sin || "SIN"} for{" "}
      {data.manufacturerName || "manufacturer name"} (if applicable). These
      products are being removed because {data.deletionRationale || "RATIONALE"}.
    </p>

    <p className="mb-3">{data.companyName} states the following:</p>

    {/* Certification */}
    <ul className="list-disc ml-6 mb-4 space-y-1">
      <li>
        The items being deleted will not be added at a later date with a higher
        price without justification for such higher price.
      </li>
    </ul>

    <p className="mb-4">
      I certify to the best of my knowledge that the information provided is
      current, complete, and accurate. All other terms and conditions of the
      contract remain unchanged.
    </p>

    {/* Contact */}
    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      {data.consultantName} of The Winvale Group at{" "}
      {data.consultantPhone} or {data.consultantEmail}.
    </p>

    {/* Signature */}
    <p className="mb-6">Sincerely,</p>

    <div>
      <p className="font-semibold">
        {data.authorizedNegotiatorName || "John R. Doe"}
      </p>
      <p>
        {data.authorizedNegotiatorTitle || "Director of Contracts"} – Authorized
        to sign on behalf of {data.companyName || "COMPANY NAME"}
      </p>
    </div>
  </div>
);
