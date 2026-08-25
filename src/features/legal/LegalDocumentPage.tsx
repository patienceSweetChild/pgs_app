export function LegalDocumentPage({
  fallbackTitle,
  title,
  body,
}: {
  fallbackTitle: string;
  title?: string;
  body?: string;
}) {
  const heading = title?.trim() || fallbackTitle;
  const content = body?.trim();

  return (
    <div className="wrapper-content">
      <section className="pt-5 pb-8">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h1 className="text-black fnt-family fs-40 mb-4">{heading}</h1>
              {content ? (
                <div
                  className="text-black fs-16 lh-28"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {content}
                </div>
              ) : (
                <p className="text-black fs-16 lh-28">
                  This document will appear here once published in the admin
                  CMS.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
