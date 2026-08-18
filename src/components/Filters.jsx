export default function Filters({
  search,
  onSearchChange,
  source,
  onSourceChange,
  country,
  onCountryChange,
  category,
  onCategoryChange,
  sourceOptions,
  countryOptions,
  onReset,
}) {
  return (
    <section className="filters" aria-label="Table filters">
      <label className="field field-search">
        <span>Search</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Name, alias, rationale, remarks…"
        />
      </label>

      <label className="field">
        <span>Source list</span>
        <select value={source} onChange={(event) => onSourceChange(event.target.value)}>
          <option value="">All lists</option>
          {sourceOptions.map((option) => (
            <option value={option} key={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Country</span>
        <select value={country} onChange={(event) => onCountryChange(event.target.value)}>
          <option value="">All countries</option>
          {countryOptions.map((option) => (
            <option value={option} key={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Category</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">All categories</option>
          <option value="restricted">Restricted</option>
          <option value="prohibited">Prohibited</option>
        </select>
      </label>

      <button className="reset-button" type="button" onClick={onReset}>Reset</button>
    </section>
  )
}
