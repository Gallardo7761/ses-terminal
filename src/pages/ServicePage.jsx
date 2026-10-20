import { useParams } from 'react-router'
import { Banner, MinistryBadge } from '@/components/ui.jsx'
import NotFound from '@/pages/NotFound.jsx'
import { findService } from '@/services/index.js'

export default function ServicePage() {
  const { id } = useParams()
  const service = findService(id)
  if (!service) return <NotFound />

  const Component = service.component
  return (
    <>
      <Banner
        title={service.name}
        subtitle={`${service.code} · Para ${service.audience} · Sesión monitorizada`}
        icon={service.icon}
        aside={
          <div className="hd-ministries">
            <small className="hd-ministries__caption">Bajo la autoridad de</small>
            {service.ministries.map((id) => (
              <MinistryBadge key={id} id={id} size="lg" />
            ))}
          </div>
        }
      >
        <p>{service.description}</p>
      </Banner>
      <Component key={service.id} />
    </>
  )
}
