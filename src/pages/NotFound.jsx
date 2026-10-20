import { Alert, Button } from '@/components/ui.jsx'
import { useNavigate } from 'react-router'
import { paths } from '@/routes.js'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="hd-stack" style={{ maxWidth: 560 }}>
      <h1 className="hd-title hd-title--lg">Recurso inexistente</h1>
      <Alert tone="danger" title="Acceso denegado">
        Este recurso no existe. Nunca ha existido. Si recuerda lo contrario, preséntese ante su Oficial de Lealtad más cercano.
      </Alert>
      <div>
        <Button onClick={() => navigate(paths.home)}>
          Volver a la terminal
        </Button>
      </div>
    </div>
  )
}
