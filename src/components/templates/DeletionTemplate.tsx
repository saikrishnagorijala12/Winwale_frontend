export const DeletionTemplate = ({ data }: { data: any }) => (
  <div
    className="relative text-[14px] leading-[1.6] text-foreground px-12 py-10"
    style={{ fontFamily: "'Times New Roman', Times, serif" }}
  >
    {/* Logo */}
    <div className="absolute top-6 right-8">
      <img src="logo.png" alt="Winvale" className="h-10 w-35 object-contain" />
    </div>

    {/* Date */}
    <p className="mb-6">{data.submissionDate || "DATE"}</p>

    {/* Address Block */}
    <p className="mb-6">
      Attn: {data.contractorName} ({data.contractNumber}) <br />
      General Services Administration <br />
      {data.gsaOfficeAddressLine} <br />
      {data.gsaOfficeCityStateZip}
    </p>

    {/* Subject */}

    <div className="mb-6">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          Deletion Modification to GSA Contract{" "}
          <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>
    <p className="mb-4">
      Dear {data.salutation} {data.contractorName}
    </p>

    {/* Body */}
    <p className="mb-4">
      The purpose of this letter is to request your approval of a Deletion
      Modification to GSA Schedule Contract{" "}
      <strong>{data.contractNumber}</strong>. The modification consists of the
      deletion of <strong>{data.numberOfProductsDeleted}</strong> item(s) listed
      under SIN <strong>{data.sin_deletions}</strong>. These products are being removed
      because <strong>{data.deletionRationale}</strong>.
    </p>

    <p className="mb-1">{data.companyName} states the following:</p>

    {/* Certification */}
    <ol
      className="ml-10 mb-4 space-y-1 list-outside"
      style={{ listStyleType: "lower-alpha" }}
    >
      <li>
        The items being deleted will not be added at a later date with a higher
        price without justification for such higher price.
      </li>
    </ol>

    <p className="mb-4">
      I certify to the best of my knowledge that the information provided is
      current, complete, and accurate. All other terms and conditions of the
      contract remain unchanged.
    </p>

    {/* Contact */}
    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> of The Winvale Group at <strong>{data.consultantPhone}</strong> or{" "}
      <strong>{data.consultantEmail}</strong>.
    </p>

    {/* Signature */}
    <p className="mb-4">Sincerely,</p>
    <div>
      <p>
        _________________________________
        <br />
        {data.contractorName || "AUTHORIZED NEGOTIATOR NAME"}
        <br />
        {data.authorizedNegotiatorTitle || "[Title]"} – Authorized to sign on
        behalf of {data.companyName || "COMPANY NAME"}
      </p>
    </div>
  </div>
);
