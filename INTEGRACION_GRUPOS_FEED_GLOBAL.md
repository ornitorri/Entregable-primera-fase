# 🔗 INTEGRACIÓN CON FEED GLOBAL

## Cómo Integrar Grupos Literarios al Feed Global Existente

Si deseas que los grupos literarios aparezcan en el apartado del feed global actual (`/comunidad`), sigue estos pasos:

---

## 🎯 Opción 1: Agregar Pestaña de Grupos al Feed Global

### 1. Modificar `/src/app/comunidad/page.tsx`

En el componente de pestañas, agrega una nueva pestaña para "Grupos":

```tsx
// Alrededor de la línea donde están los TabsTrigger, agrega:
<TabsTrigger value="grupos" className="flex items-center gap-2">
  <Users size={18} />
  Grupos Literarios
</TabsTrigger>

// Y en los TabsContent, agrega:
<TabsContent value="grupos">
  <GroupsList
    onCreateClick={() => setIsCreateFormOpen(true)}
    userRole={userRole}
    userPlan={userPlan}
  />
</TabsContent>
```

### 2. Importar el componente en la parte superior:

```tsx
import GroupsList from '@/components/groups/GroupsList';
```

### 3. Agregar estado para manejar el formulario:

```tsx
const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
```

### 4. Agregar el formulario modal:

```tsx
<CreateGroupForm
  isOpen={isCreateFormOpen}
  onClose={() => setIsCreateFormOpen(false)}
  onSuccess={() => {
    // Recargar grupos
  }}
/>
```

---

## 🎯 Opción 2: Crear una Sección Separada en el Feed Global

Si prefieres que los grupos se muestren como una sección independiente dentro del feed:

```tsx
// En /src/app/comunidad/page.tsx, agregar una nueva sección:

<section className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold flex items-center gap-2">
      <Users size={28} />
      Grupos Literarios
    </h2>
    {canCreateGroup && (
      <Button
        onClick={() => setIsCreateFormOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus size={18} className="mr-2" />
        Crear Grupo
      </Button>
    )}
  </div>
  <GroupsList
    onCreateClick={() => setIsCreateFormOpen(true)}
    userRole={userRole}
    userPlan={userPlan}
  />
</section>
```

---

## 🎯 Opción 3: Cards Horizontales en el Feed

Para mostrar los grupos como cards más compactas en el feed:

```tsx
// Componente para mostrar grupos en el feed principal

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Users, Plus } from 'lucide-react';

interface FeedGroupCardProps {
  group: {
    id: number;
    name: string;
    topic: string;
    member_count: number;
    creator_alias: string;
  };
}

export function FeedGroupCard({ group }: FeedGroupCardProps) {
  return (
    <Link href={`/grupos/${group.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{group.name}</h4>
              <p className="text-xs text-blue-600">📚 {group.topic}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{group.member_count}</span>
            </div>
            <span className="text-xs">Por {group.creator_alias}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

---

## 🎯 Opción 4: Mostrar Grupos en la Barra Lateral

Si tienes una barra lateral en el feed, puedes agregar una sección de "Grupos Populares":

```tsx
// Componente para la barra lateral

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function PopularGroupsSidebar() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Cargar grupos populares
    fetch('/api/groups?limit=5')
      .then(res => res.json())
      .then(data => setGroups(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold flex items-center gap-2">
          <Users size={18} />
          Grupos Populares
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {groups.map(group => (
            <Link key={group.id} href={`/grupos/${group.id}`}>
              <div className="p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="font-medium text-sm truncate">{group.name}</p>
                <p className="text-xs text-gray-500">{group.topic}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {group.member_count} miembros
                </p>
              </div>
            </Link>
          ))}
          <Link href="/grupos">
            <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-3 pt-3 border-t">
              Ver todos los grupos
              <ChevronRight size={14} />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 🔄 Integración con Navegación

### Agregar Enlace en el Menú

En `src/components/Navigation.tsx`, agrega el enlace a grupos:

```tsx
// Alrededor de donde están los otros enlaces, agrega:
{ 
  label: 'Grupos Literarios', 
  icon: Users, 
  href: '/grupos', 
  roles: ['admin', 'user'] 
},
```

---

## 🔐 Control de Acceso en Feed

Para mostrar el botón "Crear Grupo" solo a quienes pueden:

```tsx
// En el componente del feed:

const [user, setUser] = useState(null);

useEffect(() => {
  // Obtener usuario actual (from JWT o contexto)
  const userData = getCurrentUser();
  setUser(userData);
}, []);

const canCreateGroup = user?.role === 'admin' || user?.subscription_plan === 'embajador';

// En el JSX:
{canCreateGroup && (
  <Button onClick={() => setIsCreateFormOpen(true)}>
    Crear Grupo
  </Button>
)}
```

---

## 📊 Mostrar Estadísticas de Grupos en Dashboard

Si tienes un dashboard de admin, puedes mostrar estadísticas:

```tsx
// Componente de estadísticas de grupos

import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, TrendingUp } from 'lucide-react';

export function GroupsStats() {
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalMembers: 0,
    totalMessages: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const groups = await fetch('/api/groups').then(r => r.json());
      // Calcular estadísticas
      setStats({
        totalGroups: groups.data?.length || 0,
        totalMembers: groups.data?.reduce((sum, g) => sum + g.member_count, 0) || 0,
        totalMessages: 0 // Aquí iría la consulta de mensajes
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Grupos Creados</p>
              <p className="text-3xl font-bold">{stats.totalGroups}</p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Miembros Activos</p>
              <p className="text-3xl font-bold">{stats.totalMembers}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Mensajes</p>
              <p className="text-3xl font-bold">{stats.totalMessages}</p>
            </div>
            <MessageSquare className="text-purple-600" size={32} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🎨 Estilos y Temas

Puedes personalizar los colores de los grupos agregando clases CSS:

```css
/* En tu archivo CSS global */

.groups-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
}

.group-card {
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.group-topic-badge {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

```
☐ Importar componentes de grupos
☐ Agregar estado para formularios
☐ Mostrar lista de grupos en feed
☐ Agregar navegación a página de grupos
☐ Implementar control de acceso por rol
☐ Agregar botón "Crear Grupo" (solo admin/embajador)
☐ Integrar estadísticas en dashboard
☐ Probar navegación entre feed y grupos
☐ Probar creación de grupos
☐ Probar solicitud de entrada
☐ Probar aprobación de solicitudes
☐ Probar chat del grupo
```

---

## 🚀 RESULTADO FINAL

Una vez integrado, el feed global mostrará:

1. **Sección de Grupos Literarios** con:
   - Lista de grupos disponibles
   - Filtros por tema
   - Búsqueda
   - Opción de crear grupo (admin/embajador)

2. **Links a detalles del grupo** con:
   - Información completa del grupo
   - Lista de miembros
   - Chat del grupo (solo para miembros)
   - Solicitud de entrada (no miembros)
   - Panel de gestión (solo admin)

3. **Navegación mejorada** con:
   - Nuevo item en menú: "Grupos Literarios"
   - Enlace directo a `/grupos`

¡Listo! 🎉
