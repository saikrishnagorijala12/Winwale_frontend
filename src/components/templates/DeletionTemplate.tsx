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
    <p className="mb-4"><strong>[{data.submissionDate || "DATE"}]</strong></p>

    {/* Address Block */}

    <div className="mb-4">
      Attn: <strong>{data.contractorName}</strong> (<strong>{data.contractNumber}</strong>) <p>General Services Administration</p>
      <p><strong>{data.gsaOfficeAddressLine}</strong></p>
      <p><strong>{data.gsaOfficeCityStateZip}</strong></p>
    </div>
    {/* Subject */}
    <div className="mb-4">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          Deletion Modification to GSA Contract <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>
    <p className="mb-3">
      Dear <strong>{data.salutation}</strong> <strong>{data.contractorName}</strong>
    </p>

    {/* Body */}
    <p className="mb-3">
      The purpose of this letter is to request your approval of a Deletion
      Modification to GSA Schedule Contract <strong>{data.contractNumber}</strong>. The
      modification consists of the deletion of{" "}
      <strong>{data.numberOfProductsDeleted}</strong> item(s) listed under SIN{" "}
      <strong>{data.sin}</strong>. These
      products are being removed because <strong>{data.deletionRationale}</strong>.
    </p>

    <p className="mb-3"><strong>{data.companyName}</strong> states the following:</p>

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
      <strong>{data.consultantName}</strong> of The Winvale Group at{" "}
      <strong>{data.consultantPhone}</strong> or <strong>{data.consultantEmail}</strong>.
    </p>

    {/* Signature */}
    <p className="mb-6">Sincerely,</p>

    <div>
      <p className="font-semibold">
        <strong>{data.authorizedNegotiatorName || "John R. Doe"}</strong>
      </p>
      <p>
        <strong>{data.authorizedNegotiatorTitle || "Director of Contracts"}</strong> – Authorized
        to sign on behalf of <strong>{data.companyName || "COMPANY NAME"}</strong>
      </p>
    </div>
  </div>
);
