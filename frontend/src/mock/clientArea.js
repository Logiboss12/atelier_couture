export const currentClient = {
  nom: 'Aïssatou Diop',
  commandeSuivie: {
    ref: 'IRO-2041', modele: 'Grand boubou brodé', statut: 'En cours',
    etapes: ['Reçue', 'En cours', 'Finition', 'Prête', 'Livrée'], etapeActive: 1,
  },
  mensurations: { poitrine: 96, taille: 74, hanches: 102, epaule: 39, manche: 58, longueur: 142 },
  documents: [
    { id: 'doc1', label: 'Devis DEV-104 — Grand boubou brodé', montant: '185 000 F' },
    { id: 'doc2', label: 'Facture FAC-2026-0298 — Acompte', montant: '90 000 F' },
  ],
}
