function joined(values) {
  return Array.isArray(values) && values.length ? values.join('; ') : '—'
}

export default function RestrictedPartiesTable({ records }) {
  if (!records.length) {
    return (
      <div className="empty-state">
        No records match the current filters.
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Listed Party Name (English)</th>
            <th>Listed Party Name (Native)</th>
            <th>Aliases</th>
            <th>Country</th>
            <th>Source List</th>
            <th>Listing Rationale</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td className="name-cell">{record.name?.english || '—'}</td>
              <td>{record.name?.native || '—'}</td>
              <td>{joined(record.aliases)}</td>
              <td>{joined(record.countries)}</td>
              <td>
                <div>{record.source?.list_name || '—'}</div>
                {record.source?.category ? (
                  <span className={`badge badge-${record.source.category}`}>
                    {record.source.category}
                  </span>
                ) : null}
              </td>
              <td className="long-text">{record.listing_rationale || '—'}</td>
              <td className="long-text">{record.remarks || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
