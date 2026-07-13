import { useState } from 'react'
import { bookingDays } from '../../mock/booking.js'

export default function Booking() {
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')

  return (
    <div className="container">
      <span className="eyebrow">Rendez-vous</span>
      <h1 className="display-4 mt-2 mb-4">Réservez votre essayage</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="glass p-4">
            <div className="row row-cols-5 g-2">
              {bookingDays.map((day) => (
                <div className="col" key={day.id}>
                  <div className="text-center font-mono small text-muted mb-2">{day.date}</div>
                  <div className="d-flex flex-column gap-2">
                    {day.slots.map((slot) => {
                      const id = `${day.id}-${slot.id}`
                      const isSelected = selectedSlot?.id === id
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.dispo}
                          className={`btn btn-sm rounded-3 ${isSelected ? 'btn-iro' : 'btn-ghost'}`}
                          onClick={() => setSelectedSlot({ id, date: day.date, heure: slot.heure })}
                        >
                          {slot.heure}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="glass p-4" style={{ position: 'sticky', top: '6.5rem' }}>
            <div className="eyebrow mb-2">Récapitulatif</div>
            <div className="font-display fs-4 text-gradient mb-3">
              {selectedSlot ? `${selectedSlot.date} · ${selectedSlot.heure}` : 'Choisissez un créneau'}
            </div>

            {confirmed ? (
              <div className="status ok p-3 fs-6">
                <i className="bi bi-check-circle me-2"></i>Rendez-vous confirmé !
              </div>
            ) : (
              <>
                <input
                  type="text" className="form-control mb-2" placeholder="Nom complet"
                  value={nom} onChange={(e) => setNom(e.target.value)}
                />
                <input
                  type="tel" className="form-control mb-3" placeholder="Téléphone"
                  value={tel} onChange={(e) => setTel(e.target.value)}
                />
                <button
                  type="button" className="btn-iro btn w-100"
                  disabled={!selectedSlot || !nom || !tel}
                  onClick={() => setConfirmed(true)}
                >
                  Confirmer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
