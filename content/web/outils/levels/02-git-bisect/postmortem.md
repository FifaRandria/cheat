## Le réflexe à garder

Avec 180 commits, `git bisect` trouve le coupable en environ **8 tests** (2⁸ = 256), au lieu de
relire 180 commits un par un. C'est la recherche dichotomique, la même méthode que « couper le
problème en deux » de la leçon sur le diagnostic.

Avec un test automatique qui reproduit le bug, c'est encore plus simple :

```bash
git bisect start HEAD v1.4
git bisect run npm test
```

Git fait alors tous les tests tout seul, et désigne le premier commit fautif.
