// 🔌 EJEMPLOS DE USO - NUEVAS APIs

// ============================================
// 1️⃣ AUTENTICACIÓN Y LOGIN MEJORADO
// ============================================

// Con la verificación de bans integrada
async function loginUser(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 403) {
      // Usuario baneado
      alert('Tu cuenta ha sido baneada. Contacta con administración.');
      return;
    }

    const data = await response.json();
    
    // Guardar token y user info
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_info', JSON.stringify(data.user));
    
    // Ahora tienes acceso a:
    // - data.user.role (user, admin, logistics, marketing, publicity)
    // - data.user.avatarUrl
    // - data.user.id, firstName, lastName, etc.
    
    window.location.href = '/';
  } catch (error) {
    console.error('Login error:', error);
  }
}

// ============================================
// 2️⃣ GESTIÓN DE USUARIOS (ADMIN PANEL)
// ============================================

// Obtener lista de usuarios
async function getUsers() {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('/api/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const users = await response.json();
  console.log('Usuarios:', users);
  // Devuelve: { id, first_name, last_name, email, alias, role, is_banned, ... }
}

// Banear un usuario
async function banUser(userId: number, reason: string) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'ban',
      userId: userId,
      reason: reason || 'Violación de términos de servicio'
    })
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Usuario baneado:', data.message);
  }
}

// Desbanear un usuario
async function unbanUser(userId: number) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'unban',
      userId: userId
    })
  });

  if (response.ok) {
    console.log('Usuario desbaneado');
  }
}

// ============================================
// 3️⃣ CREAR CUENTAS DE STAFF/ADMIN
// ============================================

async function createStaffAccount(
  firstName: string,
  lastName: string,
  email: string,
  alias: string,
  password: string,
  role: 'admin' | 'logistics' | 'marketing' | 'publicity'
) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/admin/create-staff', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      alias,
      password,
      role
    })
  });

  const data = await response.json();
  
  if (response.ok) {
    console.log(`Cuenta de ${role} creada:`, data.user.email);
  } else {
    console.error('Error:', data.error);
  }
}

// Ejemplo de uso:
// createStaffAccount(
//   'Juan',
//   'Pérez',
//   'juan@readzzi.com',
//   'juanperez',
//   'Contraseña123!',
//   'logistics'
// );

// ============================================
// 4️⃣ OBTENER ESTADÍSTICAS DEL ADMIN
// ============================================

async function getAdminStats() {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/admin/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const stats = await response.json();
  
  console.log('Ingresos mensuales:', stats.monthlyRevenue);
  // Devuelve: [{ month: '2026-04', total: 12450.00 }, ...]
  
  console.log('Órdenes activas:', stats.activeOrders);
  // Devuelve: 8
  
  console.log('Base de lectores:', stats.totalUsers);
  // Devuelve: 1240
  
  console.log('Usuarios baneados:', stats.bannedUsers);
  // Devuelve: 3
  
  console.log('Órdenes recientes:', stats.recentOrders);
  // Devuelve: [{ id, first_name, last_name, total_amount, status, created_at }, ...]
  
  console.log('Libros más vendidos:', stats.topBooks);
  // Devuelve: [{ id, title, author, sold_count }, ...]
}

// ============================================
// 5️⃣ REACCIONES EN PUBLICACIONES
// ============================================

// Crear/actualizar reacción
async function reactToPost(postId: string, emoji: string) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/community/reactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId: postId,
      emoji: emoji
    })
  });

  if (response.ok) {
    console.log('Reaccionaste con', emoji);
  }
}

// Ejemplo de uso:
// reactToPost('1', '❤️');
// reactToPost('1', '👏');
// reactToPost('1', '🔥');

// Eliminar reacción
async function removeReaction(postId: string) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`/api/community/reactions?postId=${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    console.log('Reacción eliminada');
  }
}

// ============================================
// 6️⃣ COMENTARIOS EN PUBLICACIONES
// ============================================

// Obtener comentarios de una publicación
async function getPostComments(postId: string) {
  const response = await fetch(`/api/community/comments?postId=${postId}`);
  
  const comments = await response.json();
  console.log('Comentarios:', comments);
  // Devuelve: [{ id, content, created_at, user_id, first_name, last_name, avatar_url }, ...]
}

// Crear un comentario
async function commentOnPost(postId: string, content: string) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('/api/community/comments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId: postId,
      content: content
    })
  });

  if (response.ok) {
    console.log('Comentario publicado');
  }
}

// Ejemplo de uso:
// commentOnPost('1', '¡Excelente reseña!');

// Eliminar un comentario (solo propietario o admin)
async function deleteComment(commentId: number) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`/api/community/comments?commentId=${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    console.log('Comentario eliminado');
  }
}

// ============================================
// 7️⃣ OBTENER POSTS CON REACCIONES Y COMENTARIOS
// ============================================

async function getPosts(communityId?: string) {
  let url = '/api/community/posts?limit=20';
  
  if (communityId) {
    url += `&communityId=${communityId}`;
  }

  const response = await fetch(url);
  const posts = await response.json();

  // Cada post tiene:
  // {
  //   id, user_id, content, image_url, book_mention_id, created_at,
  //   first_name, last_name, avatar_url,
  //   book_title, book_author, book_cover, book_price,
  //   reactions: [{ emoji, count }, ...],
  //   commentCount: number
  // }

  return posts;
}

// ============================================
// 8️⃣ INTEGRACIÓN EN COMPONENTE REACT
// ============================================

// Ejemplo de uso en un componente de post:
/*
import PostInteractions from '@/components/community/PostInteractions';

export default function PostComponent({ post }) {
  const isAuthenticated = !!localStorage.getItem('auth_token');
  const userReacted = post.userReactedEmoji !== null; // Verificar si ya reaccionó

  return (
    <div className="post">
      <h2>{post.content}</h2>
      
      <PostInteractions
        postId={post.id}
        reactions={post.reactions}
        commentCount={post.commentCount}
        isAuthenticated={isAuthenticated}
        canReact={!userReacted}
        onReact={async (emoji) => {
          await reactToPost(post.id, emoji);
        }}
        onComment={async (content) => {
          await commentOnPost(post.id, content);
        }}
      />
    </div>
  );
}
*/

// ============================================
// 9️⃣ INTEGRACIÓN DE USER MANAGEMENT EN ADMIN
// ============================================

// Ejemplo de uso en el panel de admin:
/*
import UserManagement from '@/components/admin/UserManagement';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setUsers(data);
  };

  const handleBanUser = async (userId: number, reason: string) => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'ban',
        userId,
        reason
      })
    });

    await loadUsers();
    setLoading(false);
  };

  return (
    <UserManagement
      users={users}
      onBanUser={handleBanUser}
      onUnbanUser={(userId) => handleBanUser(userId, 'Desbaneado')}
      loading={loading}
    />
  );
}
*/

// ============================================
// 🔟 HELPER FUNCTION - LOGOUT
// ============================================

function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  window.location.href = '/';
}

// ============================================
// 1️⃣1️⃣ VERIFICAR AUTENTICACIÓN
// ============================================

function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

function getUserInfo() {
  const userJson = localStorage.getItem('user_info');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
}

function getUserRole(): string {
  const user = getUserInfo();
  return user?.role || 'user';
}

function isAdmin(): boolean {
  return getUserRole() === 'admin';
}

function hasAdminPanel(): boolean {
  const role = getUserRole();
  return ['admin', 'logistics', 'marketing', 'publicity'].includes(role);
}

// ============================================
// 1️⃣2️⃣ MANEJO DE ERRORES COMÚN
// ============================================

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Token inválido o expirado
      logout();
      throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
    }

    if (response.status === 403) {
      throw new Error('No tienes permisos para acceder a esto.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la solicitud');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Ejemplo de uso:
/*
try {
  const users = await apiCall('/api/admin/users');
  console.log(users);
} catch (error) {
  alert(error.message);
}
*/

// ============================================
// 1️⃣3️⃣ VALIDACIONES ÚTILES
// ============================================

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password: string): boolean {
  // Mínimo 6 caracteres
  return password.length >= 6;
}

function validateAlias(alias: string): boolean {
  // Solo caracteres alfanuméricos y guiones
  const regex = /^[a-zA-Z0-9_-]{3,20}$/;
  return regex.test(alias);
}

// Exportar funciones para uso en otros archivos
export {
  loginUser,
  getUsers,
  banUser,
  unbanUser,
  createStaffAccount,
  getAdminStats,
  reactToPost,
  removeReaction,
  getPostComments,
  commentOnPost,
  deleteComment,
  getPosts,
  logout,
  isAuthenticated,
  getUserInfo,
  getUserRole,
  isAdmin,
  hasAdminPanel,
  apiCall,
  validateEmail,
  validatePassword,
  validateAlias
};
