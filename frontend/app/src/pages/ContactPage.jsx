import { useState } from 'react';

const EMPTY = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function validate(values) {
  const errors = {};

  if (values.name.trim().length < 3) {
    errors.name = 'Numele trebuie să aibă cel puțin 3 caractere.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Introduceți o adresă validă, de exemplu ion@exemplu.ro.';
  }

  if (values.subject.trim().length < 5) {
    errors.subject = 'Subiectul trebuie să aibă cel puțin 5 caractere.';
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Mesajul trebuie să aibă cel puțin 10 caractere.';
  } else if (values.message.length > 500) {
    errors.message = 'Mesajul poate avea cel mult 500 de caractere.';
  }

  return errors;
}

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSent(false);
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isValid) return;

    console.log('Mesaj de trimis:', values);
    setSent(true);
    setValues(EMPTY);
    setTouched({});
  }

  return (
    <section>
      <h1>Contact</h1>

      {sent && (
        <p className="form-success" role="status">
          Mesajul a fost trimis. Mulțumim!
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Nume</label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.name && errors.name && (
            <p className="form-error">{errors.name}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.email && errors.email && (
            <p className="form-error">{errors.email}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="subject">Subiect</label>
          <input
            id="subject"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.subject && errors.subject && (
            <p className="form-error">{errors.subject}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="message">Mesaj</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <small>{values.message.length} / 500</small>
          {touched.message && errors.message && (
            <p className="form-error">{errors.message}</p>
          )}
        </div>

        <button type="submit" disabled={!isValid}>
          Trimite
        </button>
      </form>
    </section>
  );
}
