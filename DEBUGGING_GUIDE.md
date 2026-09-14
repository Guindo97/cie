# Guide de Débogage - CICE Edmonton

## 🐛 **Erreur Corrigée : `ReferenceError: index is not defined`**

### **Problème Identifié**
```javascript
// ❌ ERREUR - index non défini
{media.map((mediaItem) => (
  <OptimizedImage
    priority={index < 8} // index n'existe pas !
  />
))}
```

### **Solution Appliquée**
```javascript
// ✅ CORRIGÉ - index défini dans le map
{media.map((mediaItem, index) => (
  <OptimizedImage
    priority={index < 8} // index maintenant disponible
  />
))}
```

## 🔍 **Comment Éviter Cette Erreur**

### **1. Vérification des Variables**
Avant d'utiliser une variable dans un `.map()`, s'assurer qu'elle est définie :

```javascript
// ✅ Bon
array.map((item, index) => (
  <Component priority={index < 5} />
))

// ❌ Mauvais
array.map((item) => (
  <Component priority={index < 5} /> // index non défini
))
```

### **2. Utilisation de l'Index**
L'index est automatiquement fourni par `.map()` :
- **Premier paramètre** : L'élément actuel
- **Deuxième paramètre** : L'index (0, 1, 2, ...)

```javascript
// Syntaxe correcte
array.map((item, index) => {
  // item = élément actuel
  // index = position (0, 1, 2, ...)
})
```

### **3. Cas d'Usage Courants**
```javascript
// Priorité pour les premiers éléments
items.map((item, index) => (
  <Component priority={index < 3} />
))

// Style alterné
items.map((item, index) => (
  <div className={index % 2 === 0 ? 'even' : 'odd'} />
))

// Numérotation
items.map((item, index) => (
  <div>#{index + 1}: {item.name}</div>
))
```

## 🛠️ **Outils de Débogage**

### **1. Console DevTools**
- Ouvrir F12
- Onglet "Console"
- Voir les erreurs en rouge
- Cliquer sur le fichier pour aller à la ligne

### **2. Error Boundary**
- Capture les erreurs React
- Affiche une interface de récupération
- Détails techniques en mode développement

### **3. Vérification de Code**
```javascript
// Avant de commiter, vérifier :
// 1. Toutes les variables sont définies
// 2. Pas d'erreurs dans la console
// 3. L'application fonctionne
```

## 🚨 **Erreurs Communes à Éviter**

### **1. Variables Non Définies**
```javascript
// ❌ Mauvais
{items.map(item => (
  <div>{undefinedVariable}</div>
))}

// ✅ Bon
{items.map(item => (
  <div>{item.name}</div>
))}
```

### **2. Props Manquantes**
```javascript
// ❌ Mauvais
<Component priority={index < 5} /> // index non défini

// ✅ Bon
{items.map((item, index) => (
  <Component priority={index < 5} />
))}
```

### **3. Tableaux Non Vérifiés**
```javascript
// ❌ Mauvais
{items.map(item => <div>{item.name}</div>)}

// ✅ Bon
{items && items.length > 0 ? items.map(item => <div>{item.name}</div>) : <div>Aucun élément</div>}
```

## 🎯 **Bonnes Pratiques**

### **1. Toujours Vérifier les Données**
```javascript
// Protection contre les données undefined
{data && data.length > 0 && data.map((item, index) => (
  <Component key={item.id} priority={index < 5} />
))}
```

### **2. Utiliser des Clés Uniques**
```javascript
// ✅ Bon
{items.map((item, index) => (
  <div key={item.id || index}>
    {item.name}
  </div>
))}
```

### **3. Gestion d'Erreurs**
```javascript
// Avec try-catch
try {
  const result = items.map((item, index) => {
    return <Component key={item.id} priority={index < 5} />
  });
  return result;
} catch (error) {
  console.error('Erreur dans le map:', error);
  return <div>Erreur de chargement</div>;
}
```

## 📱 **Test de l'Application**

### **1. Vérifications Avant Commit**
- [ ] Pas d'erreurs dans la console
- [ ] Toutes les variables sont définies
- [ ] L'application se charge correctement
- [ ] Les fonctionnalités marchent

### **2. Test des Fonctionnalités**
- [ ] Navigation fonctionne
- [ ] Galerie s'ouvre sans erreur
- [ ] Images se chargent
- [ ] Pas de page blanche

### **3. Test des Erreurs**
- [ ] Error Boundary fonctionne
- [ ] Messages d'erreur informatifs
- [ ] Récupération possible
- [ ] Pas de crash complet

---

**Note** : Cette erreur est maintenant corrigée. L'application devrait fonctionner sans problème quand vous cliquez sur "Voir plus" dans la galerie !


