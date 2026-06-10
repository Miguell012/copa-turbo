// Salva e recupera imagens de campanhas usando IndexedDB
// O localStorage tem limite de ~5MB, o IndexedDB aguenta centenas de MB

const DB_NAME = 'copa-turbo-images'
const DB_VERSION = 1
const STORE_NAME = 'campaign-images'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export interface CampaignImages {
  logo?: string
  coverImage?: string
  galleryImages?: string[]
}

export async function saveImages(campaignId: string, images: CampaignImages): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(images, campaignId)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (e) {
    console.warn('Erro ao salvar imagens:', e)
  }
}

export async function getImages(campaignId: string): Promise<CampaignImages | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(campaignId)
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    console.warn('Erro ao buscar imagens:', e)
    return null
  }
}

export async function deleteImages(campaignId: string): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(campaignId)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (e) {
    console.warn('Erro ao deletar imagens:', e)
  }
}