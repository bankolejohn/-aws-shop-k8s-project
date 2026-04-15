import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="toast">
      <CheckCircle size={16} color="#10b981" />
      {message}
    </div>
  )
}