"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  CONTACT_HERO_BG,
  CONTACT_MAP_EMBED,
  CONTACT_OFFICES,
  CONTACT_SERVICES,
  CONTACT_SOCIAL,
} from "./content";

function OfficeIconBuilding() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 3.25C10.2574 3.25 9.25 4.25736 9.25 5.5V7.75H5.5C4.25736 7.75 3.25 8.75736 3.25 10V20C3.25 20.4142 3.58579 20.75 4 20.75H20C20.4142 20.75 20.75 20.4142 20.75 20V5.5C20.75 4.25736 19.7426 3.25 18.5 3.25H11.5ZM9.25 19.25H4.75V10C4.75 9.58579 5.08579 9.25 5.5 9.25H9.25V11.5V13V15.5V17V19.25ZM10.75 12.2773C10.7503 12.2683 10.7505 12.2591 10.7505 12.25C10.7505 12.2409 10.7503 12.2317 10.75 12.2227V5.5C10.75 5.08579 11.0858 4.75 11.5 4.75H18.5C18.9142 4.75 19.25 5.08579 19.25 5.5V19.25H10.75V16.2773C10.7503 16.2683 10.7505 16.2591 10.7505 16.25C10.7505 16.2409 10.7503 16.2317 10.75 16.2227V12.2773Z"
        fill="#d31f3e"
      />
      <g opacity="0.4">
        <path
          d="M7.75586 17H9.25V15.5H7.75586C7.34165 15.5 7.00586 15.8358 7.00586 16.25C7.00586 16.6642 7.34165 17 7.75586 17Z"
          fill="#d31f3e"
        />
        <path
          d="M7.75586 13H9.25V11.5H7.75586C7.34165 11.5 7.00586 11.8358 7.00586 12.25C7.00586 12.6642 7.34165 13 7.75586 13Z"
          fill="#d31f3e"
        />
        <path
          d="M12.75 14.6668C12.75 14.2526 13.0858 13.9168 13.5 13.9168H16.5C16.9142 13.9168 17.25 14.2526 17.25 14.6668C17.25 15.081 16.9142 15.4168 16.5 15.4168H13.5C13.0858 15.4168 12.75 15.081 12.75 14.6668Z"
          fill="#d31f3e"
        />
        <path
          d="M13.5 8.5835C13.0858 8.5835 12.75 8.91928 12.75 9.3335C12.75 9.74771 13.0858 10.0835 13.5 10.0835H16.5C16.9142 10.0835 17.25 9.74771 17.25 9.3335C17.25 8.91928 16.9142 8.5835 16.5 8.5835H13.5Z"
          fill="#d31f3e"
        />
      </g>
    </svg>
  );
}

function OfficeIconPhone() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.26534 3.25728C5.54121 1.98143 7.69866 2.37266 8.4453 4.01527L10.0666 7.58207C10.4662 8.46115 10.3393 9.47941 9.7603 10.2298C9.57069 10.4755 9.33228 10.6266 9.14342 10.7234L6.34328 12.1589C7.02276 13.246 7.83521 14.2739 8.78072 15.2194C9.72626 16.1649 10.7541 16.9774 11.8412 17.6569L13.2768 14.8567C13.3736 14.6679 13.5247 14.4295 13.7704 14.2399C14.5208 13.6608 15.539 13.534 16.4181 13.9336L19.9849 15.5549C21.6275 16.3015 22.0187 18.459 20.7429 19.7348L19.6747 20.803C19.1484 21.3293 18.3886 21.603 17.6192 21.4643C13.993 20.8106 10.5219 19.0819 7.72006 16.28C4.91826 13.4782 3.18949 10.0071 2.53579 6.38098C2.39708 5.61151 2.6708 4.85172 3.19715 4.32541L4.26534 3.25728ZM13.148 18.3959C14.656 19.1633 16.2534 19.694 17.8853 19.9881C18.1347 20.0331 18.4082 19.9481 18.614 19.7424L19.6822 18.6742C20.2175 18.1389 20.0534 17.2337 19.3642 16.9204L15.7974 15.2991C15.4288 15.1316 15.0014 15.1846 14.6867 15.4274C14.6867 15.4274 14.6797 15.4327 14.6657 15.4513C14.6513 15.4704 14.6332 15.499 14.6116 15.5411L13.148 18.3959ZM5.60427 10.8522L8.4591 9.38858C8.50118 9.367 8.52978 9.34884 8.54888 9.33445C8.56744 9.32046 8.57276 9.31341 8.57276 9.31341C8.81555 8.99879 8.86857 8.57137 8.70102 8.20278L7.07975 4.63597C6.76648 3.94679 5.86129 3.78265 5.32598 4.31796L4.25778 5.3861C4.05198 5.59188 3.96702 5.86538 4.01199 6.11487C4.30617 7.74671 4.83685 9.34411 5.60427 10.8522Z"
        fill="#d31f3e"
      />
      <path
        d="M18.0067 4.37572C18.0068 4.78993 17.6711 5.12583 17.2569 5.12596L16.5639 5.12618L18.0007 6.56294L20.717 3.8466C21.0099 3.55371 21.4848 3.55371 21.7777 3.8466C22.0706 4.1395 22.0706 4.61437 21.7777 4.90726L18.531 8.15393C18.3904 8.29458 18.1996 8.3736 18.0007 8.3736C17.8018 8.3736 17.611 8.29458 17.4704 8.15393L15.5043 6.18784L15.504 6.87886C15.5039 7.29307 15.168 7.62874 14.7538 7.6286C14.3396 7.62845 14.0039 7.29255 14.004 6.87833L14.0049 4.41303C13.9951 4.20924 14.0681 4.00223 14.2237 3.8466C14.3193 3.75103 14.4342 3.68664 14.5559 3.65344C14.6192 3.63606 14.6859 3.62677 14.7547 3.62675L17.2564 3.62596C17.6707 3.62583 18.0065 3.96151 18.0067 4.37572Z"
        fill="#d31f3e"
      />
    </svg>
  );
}

function OfficeIconUk() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V20C3.25 20.4142 3.58579 20.75 4 20.75H12L12.0012 20.75H17.6859L17.6875 20.75L17.6891 20.75H20C20.4142 20.75 20.75 20.4142 20.75 20C20.75 19.5858 20.4142 19.25 20 19.25H12.75V5.5C12.75 4.25736 11.7426 3.25 10.5 3.25H5.5ZM10.5 4.75C10.9142 4.75 11.25 5.08579 11.25 5.5V19.25H4.75V5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H10.5Z"
        fill="#d31f3e"
      />
      <g opacity="0.4">
        <path
          d="M6.5 12C6.5 11.5858 6.83579 11.25 7.25 11.25H8.75C9.16421 11.25 9.5 11.5858 9.5 12C9.5 12.4142 9.16421 12.75 8.75 12.75H7.25C6.83579 12.75 6.5 12.4142 6.5 12Z"
          fill="#d31f3e"
        />
        <path
          d="M7.25 15.2501C6.83579 15.2501 6.5 15.5859 6.5 16.0001C6.5 16.4143 6.83579 16.7501 7.25 16.7501H8.75C9.16421 16.7501 9.5 16.4143 9.5 16.0001C9.5 15.5859 9.16421 15.2501 8.75 15.2501H7.25Z"
          fill="#d31f3e"
        />
        <path
          d="M7.25 7.25C6.83579 7.25 6.5 7.58579 6.5 8C6.5 8.41421 6.83579 8.75 7.25 8.75H8.75C9.16421 8.75 9.5 8.41421 9.5 8C9.5 7.58579 9.16421 7.25 8.75 7.25H7.25Z"
          fill="#d31f3e"
        />
        <path
          d="M16.9375 16.6575V19.25H18.4375V16.6575C19.7663 16.323 20.75 15.1201 20.75 13.6875C20.75 11.9961 19.3789 10.625 17.6875 10.625C15.9961 10.625 14.625 11.9961 14.625 13.6875C14.625 15.1201 15.6087 16.323 16.9375 16.6575ZM19.25 13.6875C19.25 14.5504 18.5504 15.25 17.6875 15.25C16.8246 15.25 16.125 14.5504 16.125 13.6875C16.125 12.8246 16.8246 12.125 17.6875 12.125C18.5504 12.125 19.25 12.8246 19.25 13.6875Z"
          fill="#d31f3e"
        />
      </g>
    </svg>
  );
}

function officeIcon(title: string, index: number) {
  if (title === "Contact") return <OfficeIconPhone />;
  if (title.startsWith("United Kingdom")) return <OfficeIconUk />;
  return <OfficeIconBuilding key={index} />;
}

/**
 * Contact — from standalone-html/contact.html
 */
export function ContactPage() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || number.length !== 10) {
      setError("Please fill name, a valid email, and a 10-digit mobile number.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <>
      <section
        className="cover-background page-title-big-typography ipad-top-space-margin xs-py-0"
        style={{ backgroundImage: `url(${CONTACT_HERO_BG})` }}
      >
        <div className="opacity-extra-medium bg-dark-slate-blue" />
        <div className="container">
          <div className="row align-items-center extra-small-screen">
            <div className="col-9 col-xl-5 col-sm-6 position-relative page-title-extra-small pt-5">
              <div className="bg-base-color fw-600 lh-30 text-white text-uppercase border-radius-30px ps-20px pe-20px fs-11 mb-25px d-inline-block">
                Welcome to My On Apply
              </div>
              <h2 className="fw-700 text-dark-gray mb-0 ls-minus-2px sm-ls-minus-1px text-white">
                Contact us
              </h2>
              <div className="mt-auto mt-5 breadcrumb breadcrumb-style-01 alt-font text-white">
                <ul className="appear anime-child anime-complete">
                  <li>
                    <Link href="/" className="text-white">
                      Home
                    </Link>
                  </li>
                  <li>Contact us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden">
        <div className="container">
          <div className="row justify-content-center align-items-center mb-9 sm-mb-45px">
            <div className="col-xxl-5 col-lg-6 md-mb-50px">
              {CONTACT_OFFICES.map((office, i) => (
                <div
                  className="icon-with-text-style-01 mb-10 md-mb-35px"
                  key={`${office.title}-${i}`}
                >
                  <div className="feature-box feature-box-left-icon last-paragraph-no-margin">
                    <div className="feature-box-icon me-25px">
                      {officeIcon(office.title, i)}
                    </div>
                    {office.variant === "address" ? (
                      <div className="feature-box-content last-paragraph-no-margin">
                        <span className="d-block text-dark-gray fw-600 fs-18 ls-minus-05px mb-5px">
                          {office.title}
                        </span>
                        <p
                          className={
                            "narrow" in office && office.narrow
                              ? "w-60 md-w-100"
                              : "w-100 md-w-100"
                          }
                        >
                          {office.body}
                        </p>
                      </div>
                    ) : null}
                    {office.variant === "linked" ? (
                      <div className="feature-box-content">
                        <span className="d-block text-dark-gray fw-600 fs-18 ls-minus-05px mb-5px">
                          {office.title}
                        </span>
                        <div className="w-100 d-block">
                          <span className="d-block">
                            <a href={office.href}>{office.body}</a>
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {office.variant === "phones" ? (
                      <div className="feature-box-content">
                        <span className="d-block text-dark-gray fw-600 fs-18 ls-minus-05px mb-5px">
                          {office.title}
                        </span>
                        <div className="w-100 d-block">
                          <span className="d-block">
                            Phone:{" "}
                            {office.phones.map((p, idx) => (
                              <span key={p.href}>
                                {idx > 0 ? " / " : null}
                                <a href={p.href}>{p.label}</a>
                              </span>
                            ))}
                          </span>
                          <span className="d-block">
                            Email:{" "}
                            <a href={office.email.href}>{office.email.label}</a>
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-6 offset-xxl-1">
              <div className="contact-form-style-03 position-relative border-radius-10px bg-white p-14 lg-p-10 box-shadow-double-large overflow-hidden last-paragraph-no-margin">
                <h2 className="fw-700 text-dark-gray mb-30px sm-mb-20px fancy-text-style-4 ls-minus-2px">
                  Get In Touch
                </h2>

                {submitted ? (
                  <p className="text-dark-gray fs-16 mb-0">
                    Thanks, {name.trim()}. We&apos;ve received your message.
                    (Mock — wire API later.)
                  </p>
                ) : (
                  <form onSubmit={onSubmit} noValidate>
                    <div className="position-relative form-group mb-20px">
                      <span className="form-icon text-dark-gray">
                        <i className="bi bi-person icon-extra-medium" />
                      </span>
                      <input
                        className="ps-0 border-radius-0px medium-gray bg-transparent border-color-extra-medium-gray form-control required"
                        type="text"
                        name="name"
                        placeholder="Enter your name*"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="position-relative form-group mb-20px">
                      <span className="form-icon text-dark-gray">
                        <i className="bi bi-phone icon-extra-medium" />
                      </span>
                      <input
                        className="ps-0 border-radius-0px medium-gray bg-transparent border-color-extra-medium-gray form-control required"
                        type="tel"
                        name="number"
                        placeholder="Enter your mobile number*"
                        pattern="\d{10}"
                        maxLength={10}
                        value={number}
                        onChange={(e) =>
                          setNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        required
                      />
                    </div>
                    <div className="position-relative form-group mb-20px">
                      <span className="form-icon text-dark-gray">
                        <i className="bi bi-envelope icon-extra-medium" />
                      </span>
                      <input
                        className="ps-0 border-radius-0px medium-gray bg-transparent border-color-extra-medium-gray form-control required"
                        type="email"
                        name="email"
                        placeholder="Enter your email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="position-relative form-group mb-20px">
                      <span className="form-icon text-dark-gray">
                        <i className="bi bi-list icon-extra-medium" />
                      </span>
                      <select
                        className="border-radius-0px medium-gray bg-transparent border-color-extra-medium-gray form-control required ps-3"
                        name="cat_id"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                      >
                        <option value="">-- Select Service --</option>
                        {CONTACT_SERVICES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="position-relative z-index-1 form-group form-textarea mt-15px mb-0">
                      <textarea
                        className="ps-0 border-radius-0px medium-gray bg-transparent border-color-extra-medium-gray form-control required"
                        name="comment"
                        placeholder="Enter your message"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <span className="form-icon text-dark-gray">
                        <i className="bi bi-chat-square-dots icon-extra-medium" />
                      </span>
                      {error ? (
                        <p className="text-danger fs-14 mt-15px mb-0">{error}</p>
                      ) : null}
                      <button
                        className="btn btn-large btn-base-color btn-round-edge btn-box-shadow mb-20px mt-25px submit w-100"
                        type="submit"
                      >
                        Send message
                      </button>
                      <p className="fs-13 lh-22 w-90 md-w-100">
                        I understand that my data will be hold securely in
                        accordance with the{" "}
                        <a
                          className="text-decoration-line-bottom text-dark-gray fw-500"
                          href="#"
                        >
                          privacy policy.
                        </a>
                      </p>
                    </div>
                  </form>
                )}
                <div className="position-absolute bottom-0px right-minus-30px fs-350 lh-100 fw-900 text-yellow">
                  &lt;
                </div>
              </div>
            </div>
          </div>

          <div className="row align-items-center justify-content-center">
            <div className="col-md-auto text-center text-md-end sm-mb-20px">
              <h6 className="text-dark-gray fw-600 mb-0 ls-minus-1px">
                Connect with social media{" "}
              </h6>
            </div>
            <div className="col-2 d-none d-lg-inline-block">
              <span className="w-100 h-1px bg-dark-gray opacity-2 d-flex mx-auto" />
            </div>
            <div className="col-md-auto elements-social social-icon-style-04 text-center text-md-start ps-lg-0">
              <ul className="large-icon dark">
                {CONTACT_SOCIAL.map((s) => (
                  <li className="m-0" key={s.className}>
                    <a
                      className={s.className}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className={s.icon} />
                      <span />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-very-light-gray p-0">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 p-0">
              <div className="map h-650px sm-h-450px">
                <iframe
                  src={CONTACT_MAP_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office location map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
