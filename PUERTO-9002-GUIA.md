# 🛠️ SCRIPTS PARA GESTIONAR EL SERVIDOR

## 📌 OPCIÓN 1: Limpiar puerto + Iniciar servidor (TODO EN UNO)

```powershell
.\limpiar-puerto.ps1
```

**Qué hace:**
- Mata todos los procesos Node.js
- Libera el puerto 9002
- Inicia automáticamente `npm run dev`

---

## 📌 OPCIÓN 2: Solo limpiar el puerto

```powershell
.\limpiar-solo.ps1
```

**Qué hace:**
- Mata todos los procesos Node.js
- Libera el puerto 9002
- Luego tú ejecutas manualmente: `npm run dev`

---

## ⚠️ SI POWERSHELL TE PIDE PERMISOS:

Si ves un error como:
```
"No se puede cargar el archivo... debido a la directiva de ejecución"
```

Ejecuta ESTO en PowerShell (como administrador):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego elige "Y" (Sí) cuando te pregunte.

---

## 🎯 RESUMEN RÁPIDO:

**Si el puerto está ocupado:**
```powershell
.\limpiar-solo.ps1
npm run dev
```

**O todo junto:**
```powershell
.\limpiar-puerto.ps1
```

---

## 🔧 ALTERNATIVA (Sin scripts):

Si prefieres un comando de una sola línea:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep -Seconds 2; npm run dev
```

---

**✅ Ahora tienes control total sobre el puerto 9002** 🚀
