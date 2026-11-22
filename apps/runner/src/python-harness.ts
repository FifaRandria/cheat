/**
 * Mini lanceur de tests Python, écrit dans chaque job.
 * Il produit la même sortie TAP que `node --test`, ce qui permet de réutiliser
 * le même parseur. Aucune dépendance : seulement la bibliothèque standard.
 *
 * Conventions pour les auteurs de niveaux :
 *   - fichiers tests/test_*.py ;
 *   - fonctions test_* ; la première ligne de la docstring sert de nom affiché ;
 *   - le code du joueur est importable directement (src/ est dans sys.path).
 */
export const PYTHON_HARNESS = String.raw`
import contextlib, importlib.util, io, os, sys, time, traceback

sys.dont_write_bytecode = True
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
TESTS = os.path.join(ROOT, "tests")
sys.path.insert(0, SRC)

count = 0
failed = 0


def emit_logs(text):
    for line in text.splitlines():
        print("# " + line)


def describe(exc):
    """Message lisible : type, message, puis la ligne fautive dans le code du joueur."""
    msg = str(exc) if isinstance(exc, AssertionError) and str(exc) else "%s: %s" % (type(exc).__name__, exc)
    frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename.startswith(SRC)]
    if frames:
        f = frames[-1]
        msg += "\n\n  dans %s, ligne %d :\n    %s" % (os.path.relpath(f.filename, SRC).replace(os.sep, "/"), f.lineno, (f.line or "").strip())
    return msg


def report(ok, name, duration, message=None):
    global count, failed
    count += 1
    if not ok:
        failed += 1
    print("%s %d - %s" % ("ok" if ok else "not ok", count, name.replace("#", "\\#")))
    print("  ---")
    print("  duration_ms: %.3f" % duration)
    if message:
        print("  error: |-")
        for line in message.splitlines() or [""]:
            print("    " + line)
    print("  ...")


print("TAP version 13")
for fname in sorted(os.listdir(TESTS)):
    if not (fname.startswith("test_") and fname.endswith(".py")):
        continue
    buf = io.StringIO()
    try:
        spec = importlib.util.spec_from_file_location(fname[:-3], os.path.join(TESTS, fname))
        module = importlib.util.module_from_spec(spec)
        with contextlib.redirect_stdout(buf):
            spec.loader.exec_module(module)
    except Exception as exc:
        emit_logs(buf.getvalue())
        report(False, "chargement de " + fname, 0, describe(exc))
        continue
    emit_logs(buf.getvalue())

    for name, fn in list(vars(module).items()):
        if not (name.startswith("test_") and callable(fn)):
            continue
        title = (fn.__doc__ or name).strip().splitlines()[0]
        buf = io.StringIO()
        start = time.perf_counter()
        try:
            with contextlib.redirect_stdout(buf):
                fn()
            ok, message = True, None
        except Exception as exc:
            ok, message = False, describe(exc)
        emit_logs(buf.getvalue())
        report(ok, title, (time.perf_counter() - start) * 1000, message)

print("1..%d" % count)
print("# tests %d" % count)
print("# pass %d" % (count - failed))
print("# fail %d" % failed)
sys.exit(1 if failed else 0)
`;
