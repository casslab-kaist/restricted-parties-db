import { useEffect, useMemo, useState } from 'react'
import Filters from './components/Filters.jsx'
import RestrictedPartiesTable from './components/RestrictedPartiesTable.jsx'

const PAGE_SIZE = 50

function searchableText(record) {
  return [
    record.name?.english,
    record.name?.native,
    ...(record.aliases || []),
    ...(record.countries || []),
    record.listing_rationale,
    record.remarks,
    record.source?.list_name,
    record.source?.authority,
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase()
}

export default function App() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [source, setSource] = useState('')
  const [country, setCountry] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/restricted_parties.json`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setRecords(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(`Could not load data: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const sourceOptions = useMemo(
    () => [...new Set(records.map((r) => r.source?.list_name).filter(Boolean))].sort(),
    [records],
  )

  const countryOptions = useMemo(
    () => [...new Set(records.flatMap((r) => r.countries || []))].sort(),
    [records],
  )

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()

    return records.filter((record) => {
      if (query && !searchableText(record).includes(query)) return false
      if (source && record.source?.list_name !== source) return false
      if (country && !(record.countries || []).includes(country)) return false
      if (category && record.source?.category !== category) return false
      return true
    })
  }, [records, search, source, country, category])

  useEffect(() => {
    setPage(1)
  }, [search, source, country, category])

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * PAGE_SIZE
  const visibleRecords = filteredRecords.slice(start, start + PAGE_SIZE)

  function resetFilters() {
    setSearch('')
    setSource('')
    setCountry('')
    setCategory('')
  }

  if (loading) {
    return <main className="page"><p>Loading database…</p></main>
  }

  if (error) {
    return <main className="page"><div className="error-box">{error}</div></main>
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">MVP / consolidated list explorer</p>
          <h1>Restricted Parties Database</h1>
          <p className="subtitle">
            Search and filter listing-level records across consolidated restricted and prohibited party lists.
          </p>
        </div>
        <div className="count-card">
          <strong>{filteredRecords.length.toLocaleString()}</strong>
          <span>of {records.length.toLocaleString()} records</span>
        </div>
      </header>

      <Filters
        search={search}
        onSearchChange={setSearch}
        source={source}
        onSourceChange={setSource}
        country={country}
        onCountryChange={setCountry}
        category={category}
        onCategoryChange={setCategory}
        sourceOptions={sourceOptions}
        countryOptions={countryOptions}
        onReset={resetFilters}
      />

      <RestrictedPartiesTable records={visibleRecords} />

      <nav className="pagination" aria-label="Pagination">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </button>
        <span>Page {safePage} of {pageCount}</span>
        <button
          type="button"
          disabled={safePage >= pageCount}
          onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
        >
          Next
        </button>
      </nav>
    </main>
  )
}
