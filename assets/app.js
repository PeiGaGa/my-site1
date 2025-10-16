var zv = Object.defineProperty,
  Nv = Object.defineProperties;
var Hv = Object.getOwnPropertyDescriptors;
var sc = Object.getOwnPropertySymbols;
var Fv = Object.prototype.hasOwnProperty,
  Dv = Object.prototype.propertyIsEnumerable;
var dn = Math.pow,
  ic = (Fe, Oe, Re) =>
    Oe in Fe
      ? zv(Fe, Oe, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: Re,
        })
      : (Fe[Oe] = Re),
  Ie = (Fe, Oe) => {
    for (var Re in Oe || (Oe = {})) Fv.call(Oe, Re) && ic(Fe, Re, Oe[Re]);
    if (sc) for (var Re of sc(Oe)) Dv.call(Oe, Re) && ic(Fe, Re, Oe[Re]);
    return Fe;
  },
  xt = (Fe, Oe) => Nv(Fe, Hv(Oe));
var Tt = (Fe, Oe, Re) =>
  new Promise((Js, Tn) => {
    var Zs = (Ct) => {
        try {
          Jt(Re.next(Ct));
        } catch (Cn) {
          Tn(Cn);
        }
      },
      ei = (Ct) => {
        try {
          Jt(Re.throw(Ct));
        } catch (Cn) {
          Tn(Cn);
        }
      },
      Jt = (Ct) =>
        Ct.done ? Js(Ct.value) : Promise.resolve(Ct.value).then(Zs, ei);
    Jt((Re = Re.apply(Fe, Oe)).next());
  });
(function () {
  "use strict";
  var Fe = typeof document != "undefined" ? document.currentScript : null;
  function Oe(t, e = {}, n) {
    for (const s in t) {
      const i = t[s],
        r = n ? `${n}:${s}` : s;
      typeof i == "object" && i !== null
        ? Oe(i, e, r)
        : typeof i == "function" && (e[r] = i);
    }
    return e;
  }
  const Re = { run: (t) => t() },
    Js = () => Re,
    Tn = typeof console.createTask != "undefined" ? console.createTask : Js;
  function Zs(t, e) {
    const n = e.shift(),
      s = Tn(n);
    return t.reduce(
      (i, r) => i.then(() => s.run(() => r(...e))),
      Promise.resolve()
    );
  }
  function ei(t, e) {
    const n = e.shift(),
      s = Tn(n);
    return Promise.all(t.map((i) => s.run(() => i(...e))));
  }
  function Jt(t, e) {
    for (const n of [...t]) n(e);
  }
  class Ct {
    constructor() {
      (this._hooks = {}),
        (this._before = void 0),
        (this._after = void 0),
        (this._deprecatedMessages = void 0),
        (this._deprecatedHooks = {}),
        (this.hook = this.hook.bind(this)),
        (this.callHook = this.callHook.bind(this)),
        (this.callHookWith = this.callHookWith.bind(this));
    }
    hook(e, n, s = {}) {
      if (!e || typeof n != "function") return () => {};
      const i = e;
      let r;
      for (; this._deprecatedHooks[e]; )
        (r = this._deprecatedHooks[e]), (e = r.to);
      if (r && !s.allowDeprecated) {
        let o = r.message;
        o ||
          (o =
            `${i} hook has been deprecated` +
            (r.to ? `, please use ${r.to}` : "")),
          this._deprecatedMessages || (this._deprecatedMessages = new Set()),
          this._deprecatedMessages.has(o) ||
            (console.warn(o), this._deprecatedMessages.add(o));
      }
      if (!n.name)
        try {
          Object.defineProperty(n, "name", {
            get: () => "_" + e.replace(/\W+/g, "_") + "_hook_cb",
            configurable: !0,
          });
        } catch (o) {}
      return (
        (this._hooks[e] = this._hooks[e] || []),
        this._hooks[e].push(n),
        () => {
          n && (this.removeHook(e, n), (n = void 0));
        }
      );
    }
    hookOnce(e, n) {
      let s,
        i = (...r) => (
          typeof s == "function" && s(), (s = void 0), (i = void 0), n(...r)
        );
      return (s = this.hook(e, i)), s;
    }
    removeHook(e, n) {
      if (this._hooks[e]) {
        const s = this._hooks[e].indexOf(n);
        s !== -1 && this._hooks[e].splice(s, 1),
          this._hooks[e].length === 0 && delete this._hooks[e];
      }
    }
    deprecateHook(e, n) {
      this._deprecatedHooks[e] = typeof n == "string" ? { to: n } : n;
      const s = this._hooks[e] || [];
      delete this._hooks[e];
      for (const i of s) this.hook(e, i);
    }
    deprecateHooks(e) {
      Object.assign(this._deprecatedHooks, e);
      for (const n in e) this.deprecateHook(n, e[n]);
    }
    addHooks(e) {
      const n = Oe(e),
        s = Object.keys(n).map((i) => this.hook(i, n[i]));
      return () => {
        for (const i of s.splice(0, s.length)) i();
      };
    }
    removeHooks(e) {
      const n = Oe(e);
      for (const s in n) this.removeHook(s, n[s]);
    }
    removeAllHooks() {
      for (const e in this._hooks) delete this._hooks[e];
    }
    callHook(e, ...n) {
      return n.unshift(e), this.callHookWith(Zs, e, ...n);
    }
    callHookParallel(e, ...n) {
      return n.unshift(e), this.callHookWith(ei, e, ...n);
    }
    callHookWith(e, n, ...s) {
      const i =
        this._before || this._after
          ? { name: n, args: s, context: {} }
          : void 0;
      this._before && Jt(this._before, i);
      const r = e(n in this._hooks ? [...this._hooks[n]] : [], s);
      return r instanceof Promise
        ? r.finally(() => {
            this._after && i && Jt(this._after, i);
          })
        : (this._after && i && Jt(this._after, i), r);
    }
    beforeEach(e) {
      return (
        (this._before = this._before || []),
        this._before.push(e),
        () => {
          if (this._before !== void 0) {
            const n = this._before.indexOf(e);
            n !== -1 && this._before.splice(n, 1);
          }
        }
      );
    }
    afterEach(e) {
      return (
        (this._after = this._after || []),
        this._after.push(e),
        () => {
          if (this._after !== void 0) {
            const n = this._after.indexOf(e);
            n !== -1 && this._after.splice(n, 1);
          }
        }
      );
    }
  }
  function Cn() {
    return new Ct();
  }
  const rc = new Set(["link", "style", "script", "noscript"]),
    oc = new Set(["title", "titleTemplate", "script", "style", "noscript"]),
    gr = new Set(["base", "meta", "link", "style", "script", "noscript"]),
    lc = new Set([
      "title",
      "base",
      "htmlAttrs",
      "bodyAttrs",
      "meta",
      "link",
      "style",
      "script",
      "noscript",
    ]),
    ac = new Set([
      "base",
      "title",
      "titleTemplate",
      "bodyAttrs",
      "htmlAttrs",
      "templateParams",
    ]),
    cc = new Set([
      "key",
      "tagPosition",
      "tagPriority",
      "tagDuplicateStrategy",
      "innerHTML",
      "textContent",
      "processTemplateParams",
    ]),
    dc = new Set(["templateParams", "htmlAttrs", "bodyAttrs"]),
    uc = new Set([
      "theme-color",
      "google-site-verification",
      "og",
      "article",
      "book",
      "profile",
      "twitter",
      "author",
    ]),
    fc = ["name", "property", "http-equiv"],
    pc = new Set(["viewport", "description", "keywords", "robots"]);
  function mr(t) {
    const e = t.split(":");
    return e.length ? uc.has(e[1]) : !1;
  }
  function ti(t) {
    const { props: e, tag: n } = t;
    if (ac.has(n)) return n;
    if (n === "link" && e.rel === "canonical") return "canonical";
    if (e.charset) return "charset";
    if (t.tag === "meta") {
      for (const s of fc)
        if (e[s] !== void 0) {
          const i = e[s],
            r = i.includes(":"),
            o = pc.has(i),
            a = !(r || o) && t.key ? `:key:${t.key}` : "";
          return `${n}:${i}${a}`;
        }
    }
    if (t.key) return `${n}:key:${t.key}`;
    if (e.id) return `${n}:id:${e.id}`;
    if (oc.has(n)) {
      const s = t.textContent || t.innerHTML;
      if (s) return `${n}:content:${s}`;
    }
  }
  function vr(t) {
    const e = t._h || t._d;
    if (e) return e;
    const n = t.textContent || t.innerHTML;
    return (
      n ||
      `${t.tag}:${Object.entries(t.props)
        .map(([s, i]) => `${s}:${String(i)}`)
        .join(",")}`
    );
  }
  function ni(t, e, n) {
    typeof t === "function" &&
      (!n || (n !== "titleTemplate" && !(n[0] === "o" && n[1] === "n"))) &&
      (t = t());
    let i;
    if ((e && (i = e(n, t)), Array.isArray(i))) return i.map((r) => ni(r, e));
    if ((i == null ? void 0 : i.constructor) === Object) {
      const r = {};
      for (const o of Object.keys(i)) r[o] = ni(i[o], e, o);
      return r;
    }
    return i;
  }
  function hc(t, e) {
    const n = t === "style" ? new Map() : new Set();
    function s(i) {
      const r = i.trim();
      if (r)
        if (t === "style") {
          const [o, ...l] = r.split(":").map((a) => a.trim());
          o && l.length && n.set(o, l.join(":"));
        } else
          r.split(" ")
            .filter(Boolean)
            .forEach((o) => n.add(o));
    }
    return (
      typeof e == "string"
        ? t === "style"
          ? e.split(";").forEach(s)
          : s(e)
        : Array.isArray(e)
        ? e.forEach((i) => s(i))
        : e &&
          typeof e == "object" &&
          Object.entries(e).forEach(([i, r]) => {
            r && r !== "false" && (t === "style" ? n.set(i.trim(), r) : s(i));
          }),
      n
    );
  }
  function yr(t, e) {
    return (
      (t.props = t.props || {}),
      e
        ? t.tag === "templateParams"
          ? ((t.props = e), t)
          : (Object.entries(e).forEach(([n, s]) => {
              if (s === null) {
                t.props[n] = null;
                return;
              }
              if (n === "class" || n === "style") {
                t.props[n] = hc(n, s);
                return;
              }
              if (cc.has(n)) {
                if (
                  ["textContent", "innerHTML"].includes(n) &&
                  typeof s == "object"
                ) {
                  let o = e.type;
                  if (
                    (e.type || (o = "application/json"),
                    !(o != null && o.endsWith("json")) &&
                      o !== "speculationrules")
                  )
                    return;
                  (e.type = o), (t.props.type = o), (t[n] = JSON.stringify(s));
                } else t[n] = s;
                return;
              }
              const i = String(s),
                r = n.startsWith("data-");
              i === "true" || i === ""
                ? (t.props[n] = r ? i : !0)
                : !s && r && i === "false"
                ? (t.props[n] = "false")
                : s !== void 0 && (t.props[n] = s);
            }),
            t)
        : t
    );
  }
  function gc(t, e) {
    const n =
        typeof e == "object" && typeof e != "function"
          ? e
          : {
              [t === "script" || t === "noscript" || t === "style"
                ? "innerHTML"
                : "textContent"]: e,
            },
      s = yr({ tag: t, props: {} }, n);
    return (
      s.key && rc.has(s.tag) && (s.props["data-hid"] = s._h = s.key),
      s.tag === "script" &&
        typeof s.innerHTML == "object" &&
        ((s.innerHTML = JSON.stringify(s.innerHTML)),
        (s.props.type = s.props.type || "application/json")),
      Array.isArray(s.props.content)
        ? s.props.content.map((i) =>
            xt(Ie({}, s), { props: xt(Ie({}, s.props), { content: i }) })
          )
        : s
    );
  }
  function mc(t, e) {
    if (!t) return [];
    typeof t == "function" && (t = t());
    const n = (i, r) => {
      for (let o = 0; o < e.length; o++) r = e[o](i, r);
      return r;
    };
    t = n(void 0, t);
    const s = [];
    return (
      (t = ni(t, n)),
      Object.entries(t || {}).forEach(([i, r]) => {
        if (r !== void 0)
          for (const o of Array.isArray(r) ? r : [r]) s.push(gc(i, o));
      }),
      s.flat()
    );
  }
  const br = (t, e) => (t._w === e._w ? t._p - e._p : t._w - e._w),
    wr = { base: -10, title: 10 },
    vc = { critical: -8, high: -1, low: 2 },
    _r = {
      meta: { "content-security-policy": -30, charset: -20, viewport: -15 },
      link: {
        preconnect: 20,
        stylesheet: 60,
        preload: 70,
        modulepreload: 70,
        prefetch: 90,
        "dns-prefetch": 90,
        prerender: 90,
      },
      script: { async: 30, defer: 80, sync: 50 },
      style: { imported: 40, sync: 60 },
    },
    yc = /@import/,
    An = (t) => t === "" || t === !0;
  function bc(t, e) {
    var r;
    if (typeof e.tagPriority == "number") return e.tagPriority;
    let n = 100;
    const s = vc[e.tagPriority] || 0,
      i = t.resolvedOptions.disableCapoSorting
        ? { link: {}, script: {}, style: {} }
        : _r;
    if (e.tag in wr) n = wr[e.tag];
    else if (e.tag === "meta") {
      const o =
        e.props["http-equiv"] === "content-security-policy"
          ? "content-security-policy"
          : e.props.charset
          ? "charset"
          : e.props.name === "viewport"
          ? "viewport"
          : null;
      o && (n = _r.meta[o]);
    } else
      e.tag === "link" && e.props.rel
        ? (n = i.link[e.props.rel])
        : e.tag === "script"
        ? An(e.props.async)
          ? (n = i.script.async)
          : e.props.src &&
            !An(e.props.defer) &&
            !An(e.props.async) &&
            e.props.type !== "module" &&
            !((r = e.props.type) != null && r.endsWith("json"))
          ? (n = i.script.sync)
          : An(e.props.defer) &&
            e.props.src &&
            !An(e.props.async) &&
            (n = i.script.defer)
        : e.tag === "style" &&
          (n =
            e.innerHTML && yc.test(e.innerHTML)
              ? i.style.imported
              : i.style.sync);
    return (n || 100) + s;
  }
  function Sr(t, e) {
    const n = typeof e == "function" ? e(t) : e,
      s = n.key || String(t.plugins.size + 1);
    t.plugins.get(s) || (t.plugins.set(s, n), t.hooks.addHooks(n.hooks || {}));
  }
  function wc(t = {}) {
    var a;
    const e = Cn();
    e.addHooks(t.hooks || {});
    const n = !t.document,
      s = new Map(),
      i = new Map(),
      r = new Set(),
      o = {
        _entryCount: 1,
        plugins: i,
        dirty: !1,
        resolvedOptions: t,
        hooks: e,
        ssr: n,
        entries: s,
        headEntries() {
          return [...s.values()];
        },
        use: (u) => Sr(o, u),
        push(u, c) {
          var m;
          const d = Ie({}, c || {});
          delete d.head;
          const f = (m = d._index) != null ? m : o._entryCount++,
            p = { _i: f, input: u, options: d },
            h = {
              _poll(b = !1) {
                (o.dirty = !0),
                  !b && r.add(f),
                  e.callHook("entries:updated", o);
              },
              dispose() {
                s.delete(f) && o.invalidate();
              },
              patch(b) {
                (!d.mode ||
                  (d.mode === "server" && n) ||
                  (d.mode === "client" && !n)) &&
                  ((p.input = b), s.set(f, p), h._poll());
              },
            };
          return h.patch(u), h;
        },
        resolveTags() {
          return Tt(this, null, function* () {
            var h;
            const u = {
              tagMap: new Map(),
              tags: [],
              entries: [...o.entries.values()],
            };
            for (yield e.callHook("entries:resolve", u); r.size; ) {
              const m = r.values().next().value;
              r.delete(m);
              const b = s.get(m);
              if (b) {
                const w = {
                  tags: mc(b.input, t.propResolvers || []).map((g) =>
                    Object.assign(g, b.options)
                  ),
                  entry: b,
                };
                yield e.callHook("entries:normalize", w),
                  (b._tags = w.tags.map(
                    (g, y) => (
                      (g._w = bc(o, g)),
                      (g._p = (b._i << 10) + y),
                      (g._d = ti(g)),
                      g
                    )
                  ));
              }
            }
            let c = !1;
            u.entries
              .flatMap((m) =>
                (m._tags || []).map((b) =>
                  xt(Ie({}, b), { props: Ie({}, b.props) })
                )
              )
              .sort(br)
              .reduce((m, b) => {
                const w = String(b._d || b._p);
                if (!m.has(w)) return m.set(w, b);
                const g = m.get(w);
                if (
                  ((b == null ? void 0 : b.tagDuplicateStrategy) ||
                    (dc.has(b.tag) ? "merge" : null) ||
                    (b.key && b.key === g.key ? "merge" : null)) === "merge"
                ) {
                  const E = Ie({}, g.props);
                  Object.entries(b.props).forEach(
                    ([C, O]) =>
                      (E[C] =
                        C === "style"
                          ? new Map([...(g.props.style || new Map()), ...O])
                          : C === "class"
                          ? new Set([...(g.props.class || new Set()), ...O])
                          : O)
                  ),
                    m.set(w, xt(Ie({}, b), { props: E }));
                } else
                  b._p >> 10 === g._p >> 10 && b.tag === "meta" && mr(w)
                    ? (m.set(
                        w,
                        Object.assign([...(Array.isArray(g) ? g : [g]), b], b)
                      ),
                      (c = !0))
                    : (b._w === g._w
                        ? b._p > g._p
                        : (b == null ? void 0 : b._w) <
                          (g == null ? void 0 : g._w)) && m.set(w, b);
                return m;
              }, u.tagMap);
            const d = u.tagMap.get("title"),
              f = u.tagMap.get("titleTemplate");
            if (((o._title = d == null ? void 0 : d.textContent), f)) {
              const m = f == null ? void 0 : f.textContent;
              if (((o._titleTemplate = m), m)) {
                let b =
                  typeof m == "function"
                    ? m(d == null ? void 0 : d.textContent)
                    : m;
                typeof b == "string" &&
                  !o.plugins.has("template-params") &&
                  (b = b.replace(
                    "%s",
                    (d == null ? void 0 : d.textContent) || ""
                  )),
                  d
                    ? b === null
                      ? u.tagMap.delete("title")
                      : u.tagMap.set("title", xt(Ie({}, d), { textContent: b }))
                    : ((f.tag = "title"), (f.textContent = b));
              }
            }
            (u.tags = Array.from(u.tagMap.values())),
              c && (u.tags = u.tags.flat().sort(br)),
              yield e.callHook("tags:beforeResolve", u),
              yield e.callHook("tags:resolve", u),
              yield e.callHook("tags:afterResolve", u);
            const p = [];
            for (const m of u.tags) {
              const { innerHTML: b, tag: w, props: g } = m;
              if (
                lc.has(w) &&
                !(
                  Object.keys(g).length === 0 &&
                  !m.innerHTML &&
                  !m.textContent
                ) &&
                !(w === "meta" && !g.content && !g["http-equiv"] && !g.charset)
              ) {
                if (w === "script" && b) {
                  if ((h = g.type) != null && h.endsWith("json")) {
                    const y = typeof b == "string" ? b : JSON.stringify(b);
                    m.innerHTML = y.replace(/</g, "\\u003C");
                  } else
                    typeof b == "string" &&
                      (m.innerHTML = b.replace(
                        new RegExp(`</${w}`, "g"),
                        `<\\/${w}`
                      ));
                  m._d = ti(m);
                }
                p.push(m);
              }
            }
            return p;
          });
        },
        invalidate() {
          for (const u of s.values()) r.add(u._i);
          (o.dirty = !0), e.callHook("entries:updated", o);
        },
      };
    return (
      ((t == null ? void 0 : t.plugins) || []).forEach((u) => Sr(o, u)),
      o.hooks.callHook("init", o),
      (a = t.init) == null || a.forEach((u) => u && o.push(u)),
      o
    );
  }
  function Er(n) {
    return Tt(this, arguments, function* (t, e = {}) {
      const s = e.document || t.resolvedOptions.document;
      if (!s || !t.dirty) return;
      const i = { shouldRender: !0, tags: [] };
      if ((yield t.hooks.callHook("dom:beforeRender", i), !!i.shouldRender))
        return (
          t._domUpdatePromise ||
            (t._domUpdatePromise = new Promise((r) =>
              Tt(null, null, function* () {
                var h;
                const o = new Map(),
                  l = new Promise((m) => {
                    t.resolveTags().then((b) => {
                      m(
                        b.map((w) => {
                          const g = o.get(w._d) || 0,
                            y = {
                              tag: w,
                              id: (g ? `${w._d}:${g}` : w._d) || vr(w),
                              shouldRender: !0,
                            };
                          return w._d && mr(w._d) && o.set(w._d, g + 1), y;
                        })
                      );
                    });
                  });
                let a = t._dom;
                if (!a) {
                  a = {
                    title: s.title,
                    elMap: new Map()
                      .set("htmlAttrs", s.documentElement)
                      .set("bodyAttrs", s.body),
                  };
                  for (const m of ["body", "head"]) {
                    const b = (h = s[m]) == null ? void 0 : h.children;
                    for (const w of b) {
                      const g = w.tagName.toLowerCase();
                      if (!gr.has(g)) continue;
                      const y = yr(
                        { tag: g, props: {} },
                        Ie(
                          { innerHTML: w.innerHTML },
                          w
                            .getAttributeNames()
                            .reduce(
                              (E, C) => ((E[C] = w.getAttribute(C)), E),
                              {}
                            ) || {}
                        )
                      );
                      if (
                        ((y.key = w.getAttribute("data-hid") || void 0),
                        (y._d = ti(y) || vr(y)),
                        a.elMap.has(y._d))
                      ) {
                        let E = 1,
                          C = y._d;
                        for (; a.elMap.has(C); ) C = `${y._d}:${E++}`;
                        a.elMap.set(C, w);
                      } else a.elMap.set(y._d, w);
                    }
                  }
                }
                (a.pendingSideEffects = Ie({}, a.sideEffects)),
                  (a.sideEffects = {});
                function u(m, b, w) {
                  const g = `${m}:${b}`;
                  (a.sideEffects[g] = w), delete a.pendingSideEffects[g];
                }
                function c({ id: m, $el: b, tag: w }) {
                  const g = w.tag.endsWith("Attrs");
                  a.elMap.set(m, b),
                    g ||
                      (w.textContent &&
                        w.textContent !== b.textContent &&
                        (b.textContent = w.textContent),
                      w.innerHTML &&
                        w.innerHTML !== b.innerHTML &&
                        (b.innerHTML = w.innerHTML),
                      u(m, "el", () => {
                        b == null || b.remove(), a.elMap.delete(m);
                      }));
                  for (const y in w.props) {
                    if (!Object.prototype.hasOwnProperty.call(w.props, y))
                      continue;
                    const E = w.props[y];
                    if (y.startsWith("on") && typeof E == "function") {
                      const O = b == null ? void 0 : b.dataset;
                      if (O && O[`${y}fired`]) {
                        const z = y.slice(0, -5);
                        E.call(b, new Event(z.substring(2)));
                      }
                      b.getAttribute(`data-${y}`) !== "" &&
                        ((w.tag === "bodyAttrs"
                          ? s.defaultView
                          : b
                        ).addEventListener(y.substring(2), E.bind(b)),
                        b.setAttribute(`data-${y}`, ""));
                      continue;
                    }
                    const C = `attr:${y}`;
                    if (y === "class") {
                      if (!E) continue;
                      for (const O of E)
                        g && u(m, `${C}:${O}`, () => b.classList.remove(O)),
                          !b.classList.contains(O) && b.classList.add(O);
                    } else if (y === "style") {
                      if (!E) continue;
                      for (const [O, z] of E)
                        u(m, `${C}:${O}`, () => {
                          b.style.removeProperty(O);
                        }),
                          b.style.setProperty(O, z);
                    } else
                      E !== !1 &&
                        E !== null &&
                        (b.getAttribute(y) !== E &&
                          b.setAttribute(y, E === !0 ? "" : String(E)),
                        g && u(m, C, () => b.removeAttribute(y)));
                  }
                }
                const d = [],
                  f = { bodyClose: void 0, bodyOpen: void 0, head: void 0 },
                  p = yield l;
                for (const m of p) {
                  const { tag: b, shouldRender: w, id: g } = m;
                  if (w) {
                    if (b.tag === "title") {
                      (s.title = b.textContent),
                        u("title", "", () => (s.title = a.title));
                      continue;
                    }
                    (m.$el = m.$el || a.elMap.get(g)),
                      m.$el ? c(m) : gr.has(b.tag) && d.push(m);
                  }
                }
                for (const m of d) {
                  const b = m.tag.tagPosition || "head";
                  (m.$el = s.createElement(m.tag.tag)),
                    c(m),
                    (f[b] = f[b] || s.createDocumentFragment()),
                    f[b].appendChild(m.$el);
                }
                for (const m of p)
                  yield t.hooks.callHook("dom:renderTag", m, s, u);
                f.head && s.head.appendChild(f.head),
                  f.bodyOpen &&
                    s.body.insertBefore(f.bodyOpen, s.body.firstChild),
                  f.bodyClose && s.body.appendChild(f.bodyClose);
                for (const m in a.pendingSideEffects) a.pendingSideEffects[m]();
                (t._dom = a),
                  yield t.hooks.callHook("dom:rendered", { renders: p }),
                  r();
              })
            ).finally(() => {
              (t._domUpdatePromise = void 0), (t.dirty = !1);
            })),
          t._domUpdatePromise
        );
    });
  }
  function _c(t = {}) {
    var s, i, r;
    const e = ((s = t.domOptions) == null ? void 0 : s.render) || Er;
    t.document =
      t.document || (typeof window != "undefined" ? document : void 0);
    const n =
      ((r =
        (i = t.document) == null
          ? void 0
          : i.head.querySelector('script[id="unhead:payload"]')) == null
        ? void 0
        : r.innerHTML) || !1;
    return wc(
      xt(Ie({}, t), {
        plugins: [
          ...(t.plugins || []),
          { key: "client", hooks: { "entries:updated": e } },
        ],
        init: [n ? JSON.parse(n) : !1, ...(t.init || [])],
      })
    );
  }
  function Sc(t, e) {
    let n = 0;
    return () => {
      const s = ++n;
      e(() => {
        n === s && t();
      });
    };
  }
  /**
   * @vue/shared v3.5.21
   * (c) 2018-present Yuxi (Evan) You and Vue contributors
   * @license MIT
   **/ function si(t) {
    const e = Object.create(null);
    for (const n of t.split(",")) e[n] = 1;
    return (n) => n in e;
  }
  const we = {},
    un = [],
    pt = () => {},
    xr = () => !1,
    cs = (t) =>
      t.charCodeAt(0) === 111 &&
      t.charCodeAt(1) === 110 &&
      (t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97),
    ii = (t) => t.startsWith("onUpdate:"),
    ke = Object.assign,
    ri = (t, e) => {
      const n = t.indexOf(e);
      n > -1 && t.splice(n, 1);
    },
    Ec = Object.prototype.hasOwnProperty,
    me = (t, e) => Ec.call(t, e),
    ne = Array.isArray,
    fn = (t) => ds(t) === "[object Map]",
    Tr = (t) => ds(t) === "[object Set]",
    ie = (t) => typeof t == "function",
    Ae = (t) => typeof t == "string",
    zt = (t) => typeof t == "symbol",
    Te = (t) => t !== null && typeof t == "object",
    Cr = (t) => (Te(t) || ie(t)) && ie(t.then) && ie(t.catch),
    Ar = Object.prototype.toString,
    ds = (t) => Ar.call(t),
    xc = (t) => ds(t).slice(8, -1),
    Mr = (t) => ds(t) === "[object Object]",
    oi = (t) =>
      Ae(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t,
    Mn = si(
      ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
    ),
    us = (t) => {
      const e = Object.create(null);
      return (n) => e[n] || (e[n] = t(n));
    },
    Tc = /-\w/g,
    st = us((t) => t.replace(Tc, (e) => e.slice(1).toUpperCase())),
    Cc = /\B([A-Z])/g,
    Zt = us((t) => t.replace(Cc, "-$1").toLowerCase()),
    fs = us((t) => t.charAt(0).toUpperCase() + t.slice(1)),
    li = us((t) => (t ? `on${fs(t)}` : "")),
    Nt = (t, e) => !Object.is(t, e),
    ai = (t, ...e) => {
      for (let n = 0; n < t.length; n++) t[n](...e);
    },
    Pr = (t, e, n, s = !1) => {
      Object.defineProperty(t, e, {
        configurable: !0,
        enumerable: !1,
        writable: s,
        value: n,
      });
    },
    Ac = (t) => {
      const e = parseFloat(t);
      return isNaN(e) ? t : e;
    },
    Mc = (t) => {
      const e = Ae(t) ? Number(t) : NaN;
      return isNaN(e) ? t : e;
    };
  let Lr;
  const ps = () =>
    Lr ||
    (Lr =
      typeof globalThis != "undefined"
        ? globalThis
        : typeof self != "undefined"
        ? self
        : typeof window != "undefined"
        ? window
        : typeof global != "undefined"
        ? global
        : {});
  function ci(t) {
    if (ne(t)) {
      const e = {};
      for (let n = 0; n < t.length; n++) {
        const s = t[n],
          i = Ae(s) ? Oc(s) : ci(s);
        if (i) for (const r in i) e[r] = i[r];
      }
      return e;
    } else if (Ae(t) || Te(t)) return t;
  }
  const Pc = /;(?![^(]*\))/g,
    Lc = /:([^]+)/,
    Ic = /\/\*[^]*?\*\//g;
  function Oc(t) {
    const e = {};
    return (
      t
        .replace(Ic, "")
        .split(Pc)
        .forEach((n) => {
          if (n) {
            const s = n.split(Lc);
            s.length > 1 && (e[s[0].trim()] = s[1].trim());
          }
        }),
      e
    );
  }
  function De(t) {
    let e = "";
    if (Ae(t)) e = t;
    else if (ne(t))
      for (let n = 0; n < t.length; n++) {
        const s = De(t[n]);
        s && (e += s + " ");
      }
    else if (Te(t)) for (const n in t) t[n] && (e += n + " ");
    return e.trim();
  }
  const kc = si(
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly"
  );
  function Ir(t) {
    return !!t || t === "";
  }
  const Or = (t) => !!(t && t.__v_isRef === !0),
    _e = (t) =>
      Ae(t)
        ? t
        : t == null
        ? ""
        : ne(t) || (Te(t) && (t.toString === Ar || !ie(t.toString)))
        ? Or(t)
          ? _e(t.value)
          : JSON.stringify(t, kr, 2)
        : String(t),
    kr = (t, e) =>
      Or(e)
        ? kr(t, e.value)
        : fn(e)
        ? {
            [`Map(${e.size})`]: [...e.entries()].reduce(
              (n, [s, i], r) => ((n[di(s, r) + " =>"] = i), n),
              {}
            ),
          }
        : Tr(e)
        ? { [`Set(${e.size})`]: [...e.values()].map((n) => di(n)) }
        : zt(e)
        ? di(e)
        : Te(e) && !ne(e) && !Mr(e)
        ? String(e)
        : e,
    di = (t, e = "") => {
      var n;
      return zt(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t;
    };
  /**
   * @vue/reactivity v3.5.21
   * (c) 2018-present Yuxi (Evan) You and Vue contributors
   * @license MIT
   **/ let Ke;
  class Rc {
    constructor(e = !1) {
      (this.detached = e),
        (this._active = !0),
        (this._on = 0),
        (this.effects = []),
        (this.cleanups = []),
        (this._isPaused = !1),
        (this.parent = Ke),
        !e &&
          Ke &&
          (this.index = (Ke.scopes || (Ke.scopes = [])).push(this) - 1);
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = !0;
        let e, n;
        if (this.scopes)
          for (e = 0, n = this.scopes.length; e < n; e++)
            this.scopes[e].pause();
        for (e = 0, n = this.effects.length; e < n; e++)
          this.effects[e].pause();
      }
    }
    resume() {
      if (this._active && this._isPaused) {
        this._isPaused = !1;
        let e, n;
        if (this.scopes)
          for (e = 0, n = this.scopes.length; e < n; e++)
            this.scopes[e].resume();
        for (e = 0, n = this.effects.length; e < n; e++)
          this.effects[e].resume();
      }
    }
    run(e) {
      if (this._active) {
        const n = Ke;
        try {
          return (Ke = this), e();
        } finally {
          Ke = n;
        }
      }
    }
    on() {
      ++this._on === 1 && ((this.prevScope = Ke), (Ke = this));
    }
    off() {
      this._on > 0 &&
        --this._on === 0 &&
        ((Ke = this.prevScope), (this.prevScope = void 0));
    }
    stop(e) {
      if (this._active) {
        this._active = !1;
        let n, s;
        for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop();
        for (
          this.effects.length = 0, n = 0, s = this.cleanups.length;
          n < s;
          n++
        )
          this.cleanups[n]();
        if (((this.cleanups.length = 0), this.scopes)) {
          for (n = 0, s = this.scopes.length; n < s; n++)
            this.scopes[n].stop(!0);
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !e) {
          const i = this.parent.scopes.pop();
          i &&
            i !== this &&
            ((this.parent.scopes[this.index] = i), (i.index = this.index));
        }
        this.parent = void 0;
      }
    }
  }
  function Bc() {
    return Ke;
  }
  let Se;
  const ui = new WeakSet();
  class Rr {
    constructor(e) {
      (this.fn = e),
        (this.deps = void 0),
        (this.depsTail = void 0),
        (this.flags = 5),
        (this.next = void 0),
        (this.cleanup = void 0),
        (this.scheduler = void 0),
        Ke && Ke.active && Ke.effects.push(this);
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      this.flags & 64 &&
        ((this.flags &= -65),
        ui.has(this) && (ui.delete(this), this.trigger()));
    }
    notify() {
      (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || $r(this);
    }
    run() {
      if (!(this.flags & 1)) return this.fn();
      (this.flags |= 2), Dr(this), zr(this);
      const e = Se,
        n = lt;
      (Se = this), (lt = !0);
      try {
        return this.fn();
      } finally {
        Nr(this), (Se = e), (lt = n), (this.flags &= -3);
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let e = this.deps; e; e = e.nextDep) gi(e);
        (this.deps = this.depsTail = void 0),
          Dr(this),
          this.onStop && this.onStop(),
          (this.flags &= -2);
      }
    }
    trigger() {
      this.flags & 64
        ? ui.add(this)
        : this.scheduler
        ? this.scheduler()
        : this.runIfDirty();
    }
    runIfDirty() {
      hi(this) && this.run();
    }
    get dirty() {
      return hi(this);
    }
  }
  let Br = 0,
    Pn,
    Ln;
  function $r(t, e = !1) {
    if (((t.flags |= 8), e)) {
      (t.next = Ln), (Ln = t);
      return;
    }
    (t.next = Pn), (Pn = t);
  }
  function fi() {
    Br++;
  }
  function pi() {
    if (--Br > 0) return;
    if (Ln) {
      let e = Ln;
      for (Ln = void 0; e; ) {
        const n = e.next;
        (e.next = void 0), (e.flags &= -9), (e = n);
      }
    }
    let t;
    for (; Pn; ) {
      let e = Pn;
      for (Pn = void 0; e; ) {
        const n = e.next;
        if (((e.next = void 0), (e.flags &= -9), e.flags & 1))
          try {
            e.trigger();
          } catch (s) {
            t || (t = s);
          }
        e = n;
      }
    }
    if (t) throw t;
  }
  function zr(t) {
    for (let e = t.deps; e; e = e.nextDep)
      (e.version = -1),
        (e.prevActiveLink = e.dep.activeLink),
        (e.dep.activeLink = e);
  }
  function Nr(t) {
    let e,
      n = t.depsTail,
      s = n;
    for (; s; ) {
      const i = s.prevDep;
      s.version === -1 ? (s === n && (n = i), gi(s), $c(s)) : (e = s),
        (s.dep.activeLink = s.prevActiveLink),
        (s.prevActiveLink = void 0),
        (s = i);
    }
    (t.deps = e), (t.depsTail = n);
  }
  function hi(t) {
    for (let e = t.deps; e; e = e.nextDep)
      if (
        e.dep.version !== e.version ||
        (e.dep.computed && (Hr(e.dep.computed) || e.dep.version !== e.version))
      )
        return !0;
    return !!t._dirty;
  }
  function Hr(t) {
    if (
      (t.flags & 4 && !(t.flags & 16)) ||
      ((t.flags &= -17), t.globalVersion === In) ||
      ((t.globalVersion = In),
      !t.isSSR && t.flags & 128 && ((!t.deps && !t._dirty) || !hi(t)))
    )
      return;
    t.flags |= 2;
    const e = t.dep,
      n = Se,
      s = lt;
    (Se = t), (lt = !0);
    try {
      zr(t);
      const i = t.fn(t._value);
      (e.version === 0 || Nt(i, t._value)) &&
        ((t.flags |= 128), (t._value = i), e.version++);
    } catch (i) {
      throw (e.version++, i);
    } finally {
      (Se = n), (lt = s), Nr(t), (t.flags &= -3);
    }
  }
  function gi(t, e = !1) {
    const { dep: n, prevSub: s, nextSub: i } = t;
    if (
      (s && ((s.nextSub = i), (t.prevSub = void 0)),
      i && ((i.prevSub = s), (t.nextSub = void 0)),
      n.subs === t && ((n.subs = s), !s && n.computed))
    ) {
      n.computed.flags &= -5;
      for (let r = n.computed.deps; r; r = r.nextDep) gi(r, !0);
    }
    !e && !--n.sc && n.map && n.map.delete(n.key);
  }
  function $c(t) {
    const { prevDep: e, nextDep: n } = t;
    e && ((e.nextDep = n), (t.prevDep = void 0)),
      n && ((n.prevDep = e), (t.nextDep = void 0));
  }
  let lt = !0;
  const Fr = [];
  function ht() {
    Fr.push(lt), (lt = !1);
  }
  function gt() {
    const t = Fr.pop();
    lt = t === void 0 ? !0 : t;
  }
  function Dr(t) {
    const { cleanup: e } = t;
    if (((t.cleanup = void 0), e)) {
      const n = Se;
      Se = void 0;
      try {
        e();
      } finally {
        Se = n;
      }
    }
  }
  let In = 0;
  class zc {
    constructor(e, n) {
      (this.sub = e),
        (this.dep = n),
        (this.version = n.version),
        (this.nextDep =
          this.prevDep =
          this.nextSub =
          this.prevSub =
          this.prevActiveLink =
            void 0);
    }
  }
  class mi {
    constructor(e) {
      (this.computed = e),
        (this.version = 0),
        (this.activeLink = void 0),
        (this.subs = void 0),
        (this.map = void 0),
        (this.key = void 0),
        (this.sc = 0),
        (this.__v_skip = !0);
    }
    track(e) {
      if (!Se || !lt || Se === this.computed) return;
      let n = this.activeLink;
      if (n === void 0 || n.sub !== Se)
        (n = this.activeLink = new zc(Se, this)),
          Se.deps
            ? ((n.prevDep = Se.depsTail),
              (Se.depsTail.nextDep = n),
              (Se.depsTail = n))
            : (Se.deps = Se.depsTail = n),
          Gr(n);
      else if (n.version === -1 && ((n.version = this.version), n.nextDep)) {
        const s = n.nextDep;
        (s.prevDep = n.prevDep),
          n.prevDep && (n.prevDep.nextDep = s),
          (n.prevDep = Se.depsTail),
          (n.nextDep = void 0),
          (Se.depsTail.nextDep = n),
          (Se.depsTail = n),
          Se.deps === n && (Se.deps = s);
      }
      return n;
    }
    trigger(e) {
      this.version++, In++, this.notify(e);
    }
    notify(e) {
      fi();
      try {
        for (let n = this.subs; n; n = n.prevSub)
          n.sub.notify() && n.sub.dep.notify();
      } finally {
        pi();
      }
    }
  }
  function Gr(t) {
    if ((t.dep.sc++, t.sub.flags & 4)) {
      const e = t.dep.computed;
      if (e && !t.dep.subs) {
        e.flags |= 20;
        for (let s = e.deps; s; s = s.nextDep) Gr(s);
      }
      const n = t.dep.subs;
      n !== t && ((t.prevSub = n), n && (n.nextSub = t)), (t.dep.subs = t);
    }
  }
  const vi = new WeakMap(),
    en = Symbol(""),
    yi = Symbol(""),
    On = Symbol("");
  function Ne(t, e, n) {
    if (lt && Se) {
      let s = vi.get(t);
      s || vi.set(t, (s = new Map()));
      let i = s.get(n);
      i || (s.set(n, (i = new mi())), (i.map = s), (i.key = n)), i.track();
    }
  }
  function At(t, e, n, s, i, r) {
    const o = vi.get(t);
    if (!o) {
      In++;
      return;
    }
    const l = (a) => {
      a && a.trigger();
    };
    if ((fi(), e === "clear")) o.forEach(l);
    else {
      const a = ne(t),
        u = a && oi(n);
      if (a && n === "length") {
        const c = Number(s);
        o.forEach((d, f) => {
          (f === "length" || f === On || (!zt(f) && f >= c)) && l(d);
        });
      } else
        switch (
          ((n !== void 0 || o.has(void 0)) && l(o.get(n)), u && l(o.get(On)), e)
        ) {
          case "add":
            a ? u && l(o.get("length")) : (l(o.get(en)), fn(t) && l(o.get(yi)));
            break;
          case "delete":
            a || (l(o.get(en)), fn(t) && l(o.get(yi)));
            break;
          case "set":
            fn(t) && l(o.get(en));
            break;
        }
    }
    pi();
  }
  function pn(t) {
    const e = pe(t);
    return e === t ? e : (Ne(e, "iterate", On), it(t) ? e : e.map(Be));
  }
  function hs(t) {
    return Ne((t = pe(t)), "iterate", On), t;
  }
  const Nc = {
    __proto__: null,
    [Symbol.iterator]() {
      return bi(this, Symbol.iterator, Be);
    },
    concat(...t) {
      return pn(this).concat(...t.map((e) => (ne(e) ? pn(e) : e)));
    },
    entries() {
      return bi(this, "entries", (t) => ((t[1] = Be(t[1])), t));
    },
    every(t, e) {
      return Mt(this, "every", t, e, void 0, arguments);
    },
    filter(t, e) {
      return Mt(this, "filter", t, e, (n) => n.map(Be), arguments);
    },
    find(t, e) {
      return Mt(this, "find", t, e, Be, arguments);
    },
    findIndex(t, e) {
      return Mt(this, "findIndex", t, e, void 0, arguments);
    },
    findLast(t, e) {
      return Mt(this, "findLast", t, e, Be, arguments);
    },
    findLastIndex(t, e) {
      return Mt(this, "findLastIndex", t, e, void 0, arguments);
    },
    forEach(t, e) {
      return Mt(this, "forEach", t, e, void 0, arguments);
    },
    includes(...t) {
      return wi(this, "includes", t);
    },
    indexOf(...t) {
      return wi(this, "indexOf", t);
    },
    join(t) {
      return pn(this).join(t);
    },
    lastIndexOf(...t) {
      return wi(this, "lastIndexOf", t);
    },
    map(t, e) {
      return Mt(this, "map", t, e, void 0, arguments);
    },
    pop() {
      return kn(this, "pop");
    },
    push(...t) {
      return kn(this, "push", t);
    },
    reduce(t, ...e) {
      return jr(this, "reduce", t, e);
    },
    reduceRight(t, ...e) {
      return jr(this, "reduceRight", t, e);
    },
    shift() {
      return kn(this, "shift");
    },
    some(t, e) {
      return Mt(this, "some", t, e, void 0, arguments);
    },
    splice(...t) {
      return kn(this, "splice", t);
    },
    toReversed() {
      return pn(this).toReversed();
    },
    toSorted(t) {
      return pn(this).toSorted(t);
    },
    toSpliced(...t) {
      return pn(this).toSpliced(...t);
    },
    unshift(...t) {
      return kn(this, "unshift", t);
    },
    values() {
      return bi(this, "values", Be);
    },
  };
  function bi(t, e, n) {
    const s = hs(t),
      i = s[e]();
    return (
      s !== t &&
        !it(t) &&
        ((i._next = i.next),
        (i.next = () => {
          const r = i._next();
          return r.value && (r.value = n(r.value)), r;
        })),
      i
    );
  }
  const Hc = Array.prototype;
  function Mt(t, e, n, s, i, r) {
    const o = hs(t),
      l = o !== t && !it(t),
      a = o[e];
    if (a !== Hc[e]) {
      const d = a.apply(t, r);
      return l ? Be(d) : d;
    }
    let u = n;
    o !== t &&
      (l
        ? (u = function (d, f) {
            return n.call(this, Be(d), f, t);
          })
        : n.length > 2 &&
          (u = function (d, f) {
            return n.call(this, d, f, t);
          }));
    const c = a.call(o, u, s);
    return l && i ? i(c) : c;
  }
  function jr(t, e, n, s) {
    const i = hs(t);
    let r = n;
    return (
      i !== t &&
        (it(t)
          ? n.length > 3 &&
            (r = function (o, l, a) {
              return n.call(this, o, l, a, t);
            })
          : (r = function (o, l, a) {
              return n.call(this, o, Be(l), a, t);
            })),
      i[e](r, ...s)
    );
  }
  function wi(t, e, n) {
    const s = pe(t);
    Ne(s, "iterate", On);
    const i = s[e](...n);
    return (i === -1 || i === !1) && Si(n[0])
      ? ((n[0] = pe(n[0])), s[e](...n))
      : i;
  }
  function kn(t, e, n = []) {
    ht(), fi();
    const s = pe(t)[e].apply(t, n);
    return pi(), gt(), s;
  }
  const Fc = si("__proto__,__v_isRef,__isVue"),
    Vr = new Set(
      Object.getOwnPropertyNames(Symbol)
        .filter((t) => t !== "arguments" && t !== "caller")
        .map((t) => Symbol[t])
        .filter(zt)
    );
  function Dc(t) {
    zt(t) || (t = String(t));
    const e = pe(this);
    return Ne(e, "has", t), e.hasOwnProperty(t);
  }
  class Ur {
    constructor(e = !1, n = !1) {
      (this._isReadonly = e), (this._isShallow = n);
    }
    get(e, n, s) {
      if (n === "__v_skip") return e.__v_skip;
      const i = this._isReadonly,
        r = this._isShallow;
      if (n === "__v_isReactive") return !i;
      if (n === "__v_isReadonly") return i;
      if (n === "__v_isShallow") return r;
      if (n === "__v_raw")
        return s === (i ? (r ? Xr : Qr) : r ? Yr : Kr).get(e) ||
          Object.getPrototypeOf(e) === Object.getPrototypeOf(s)
          ? e
          : void 0;
      const o = ne(e);
      if (!i) {
        let a;
        if (o && (a = Nc[n])) return a;
        if (n === "hasOwnProperty") return Dc;
      }
      const l = Reflect.get(e, n, $e(e) ? e : s);
      return (zt(n) ? Vr.has(n) : Fc(n)) || (i || Ne(e, "get", n), r)
        ? l
        : $e(l)
        ? o && oi(n)
          ? l
          : l.value
        : Te(l)
        ? i
          ? Zr(l)
          : ys(l)
        : l;
    }
  }
  class Wr extends Ur {
    constructor(e = !1) {
      super(!1, e);
    }
    set(e, n, s, i) {
      let r = e[n];
      if (!this._isShallow) {
        const a = Ht(r);
        if (
          (!it(s) && !Ht(s) && ((r = pe(r)), (s = pe(s))),
          !ne(e) && $e(r) && !$e(s))
        )
          return a || (r.value = s), !0;
      }
      const o = ne(e) && oi(n) ? Number(n) < e.length : me(e, n),
        l = Reflect.set(e, n, s, $e(e) ? e : i);
      return (
        e === pe(i) &&
          (o ? Nt(s, r) && At(e, "set", n, s) : At(e, "add", n, s)),
        l
      );
    }
    deleteProperty(e, n) {
      const s = me(e, n);
      e[n];
      const i = Reflect.deleteProperty(e, n);
      return i && s && At(e, "delete", n, void 0), i;
    }
    has(e, n) {
      const s = Reflect.has(e, n);
      return (!zt(n) || !Vr.has(n)) && Ne(e, "has", n), s;
    }
    ownKeys(e) {
      return Ne(e, "iterate", ne(e) ? "length" : en), Reflect.ownKeys(e);
    }
  }
  class qr extends Ur {
    constructor(e = !1) {
      super(!0, e);
    }
    set(e, n) {
      return !0;
    }
    deleteProperty(e, n) {
      return !0;
    }
  }
  const Gc = new Wr(),
    jc = new qr(),
    Vc = new Wr(!0),
    Uc = new qr(!0),
    _i = (t) => t,
    gs = (t) => Reflect.getPrototypeOf(t);
  function Wc(t, e, n) {
    return function (...s) {
      const i = this.__v_raw,
        r = pe(i),
        o = fn(r),
        l = t === "entries" || (t === Symbol.iterator && o),
        a = t === "keys" && o,
        u = i[t](...s),
        c = n ? _i : e ? ws : Be;
      return (
        !e && Ne(r, "iterate", a ? yi : en),
        {
          next() {
            const { value: d, done: f } = u.next();
            return f
              ? { value: d, done: f }
              : { value: l ? [c(d[0]), c(d[1])] : c(d), done: f };
          },
          [Symbol.iterator]() {
            return this;
          },
        }
      );
    };
  }
  function ms(t) {
    return function (...e) {
      return t === "delete" ? !1 : t === "clear" ? void 0 : this;
    };
  }
  function qc(t, e) {
    const n = {
      get(i) {
        const r = this.__v_raw,
          o = pe(r),
          l = pe(i);
        t || (Nt(i, l) && Ne(o, "get", i), Ne(o, "get", l));
        const { has: a } = gs(o),
          u = e ? _i : t ? ws : Be;
        if (a.call(o, i)) return u(r.get(i));
        if (a.call(o, l)) return u(r.get(l));
        r !== o && r.get(i);
      },
      get size() {
        const i = this.__v_raw;
        return !t && Ne(pe(i), "iterate", en), i.size;
      },
      has(i) {
        const r = this.__v_raw,
          o = pe(r),
          l = pe(i);
        return (
          t || (Nt(i, l) && Ne(o, "has", i), Ne(o, "has", l)),
          i === l ? r.has(i) : r.has(i) || r.has(l)
        );
      },
      forEach(i, r) {
        const o = this,
          l = o.__v_raw,
          a = pe(l),
          u = e ? _i : t ? ws : Be;
        return (
          !t && Ne(a, "iterate", en),
          l.forEach((c, d) => i.call(r, u(c), u(d), o))
        );
      },
    };
    return (
      ke(
        n,
        t
          ? {
              add: ms("add"),
              set: ms("set"),
              delete: ms("delete"),
              clear: ms("clear"),
            }
          : {
              add(i) {
                !e && !it(i) && !Ht(i) && (i = pe(i));
                const r = pe(this);
                return (
                  gs(r).has.call(r, i) || (r.add(i), At(r, "add", i, i)), this
                );
              },
              set(i, r) {
                !e && !it(r) && !Ht(r) && (r = pe(r));
                const o = pe(this),
                  { has: l, get: a } = gs(o);
                let u = l.call(o, i);
                u || ((i = pe(i)), (u = l.call(o, i)));
                const c = a.call(o, i);
                return (
                  o.set(i, r),
                  u ? Nt(r, c) && At(o, "set", i, r) : At(o, "add", i, r),
                  this
                );
              },
              delete(i) {
                const r = pe(this),
                  { has: o, get: l } = gs(r);
                let a = o.call(r, i);
                a || ((i = pe(i)), (a = o.call(r, i))), l && l.call(r, i);
                const u = r.delete(i);
                return a && At(r, "delete", i, void 0), u;
              },
              clear() {
                const i = pe(this),
                  r = i.size !== 0,
                  o = i.clear();
                return r && At(i, "clear", void 0, void 0), o;
              },
            }
      ),
      ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
        n[i] = Wc(i, t, e);
      }),
      n
    );
  }
  function vs(t, e) {
    const n = qc(t, e);
    return (s, i, r) =>
      i === "__v_isReactive"
        ? !t
        : i === "__v_isReadonly"
        ? t
        : i === "__v_raw"
        ? s
        : Reflect.get(me(n, i) && i in s ? n : s, i, r);
  }
  const Kc = { get: vs(!1, !1) },
    Yc = { get: vs(!1, !0) },
    Qc = { get: vs(!0, !1) },
    Xc = { get: vs(!0, !0) },
    Kr = new WeakMap(),
    Yr = new WeakMap(),
    Qr = new WeakMap(),
    Xr = new WeakMap();
  function Jc(t) {
    switch (t) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function Zc(t) {
    return t.__v_skip || !Object.isExtensible(t) ? 0 : Jc(xc(t));
  }
  function ys(t) {
    return Ht(t) ? t : bs(t, !1, Gc, Kc, Kr);
  }
  function Jr(t) {
    return bs(t, !1, Vc, Yc, Yr);
  }
  function Zr(t) {
    return bs(t, !0, jc, Qc, Qr);
  }
  function jv(t) {
    return bs(t, !0, Uc, Xc, Xr);
  }
  function bs(t, e, n, s, i) {
    if (!Te(t) || (t.__v_raw && !(e && t.__v_isReactive))) return t;
    const r = Zc(t);
    if (r === 0) return t;
    const o = i.get(t);
    if (o) return o;
    const l = new Proxy(t, r === 2 ? s : n);
    return i.set(t, l), l;
  }
  function hn(t) {
    return Ht(t) ? hn(t.__v_raw) : !!(t && t.__v_isReactive);
  }
  function Ht(t) {
    return !!(t && t.__v_isReadonly);
  }
  function it(t) {
    return !!(t && t.__v_isShallow);
  }
  function Si(t) {
    return t ? !!t.__v_raw : !1;
  }
  function pe(t) {
    const e = t && t.__v_raw;
    return e ? pe(e) : t;
  }
  function ed(t) {
    return (
      !me(t, "__v_skip") && Object.isExtensible(t) && Pr(t, "__v_skip", !0), t
    );
  }
  const Be = (t) => (Te(t) ? ys(t) : t),
    ws = (t) => (Te(t) ? Zr(t) : t);
  function $e(t) {
    return t ? t.__v_isRef === !0 : !1;
  }
  function ae(t) {
    return eo(t, !1);
  }
  function td(t) {
    return eo(t, !0);
  }
  function eo(t, e) {
    return $e(t) ? t : new nd(t, e);
  }
  class nd {
    constructor(e, n) {
      (this.dep = new mi()),
        (this.__v_isRef = !0),
        (this.__v_isShallow = !1),
        (this._rawValue = n ? e : pe(e)),
        (this._value = n ? e : Be(e)),
        (this.__v_isShallow = n);
    }
    get value() {
      return this.dep.track(), this._value;
    }
    set value(e) {
      const n = this._rawValue,
        s = this.__v_isShallow || it(e) || Ht(e);
      (e = s ? e : pe(e)),
        Nt(e, n) &&
          ((this._rawValue = e),
          (this._value = s ? e : Be(e)),
          this.dep.trigger());
    }
  }
  function te(t) {
    return $e(t) ? t.value : t;
  }
  const sd = {
    get: (t, e, n) => (e === "__v_raw" ? t : te(Reflect.get(t, e, n))),
    set: (t, e, n, s) => {
      const i = t[e];
      return $e(i) && !$e(n) ? ((i.value = n), !0) : Reflect.set(t, e, n, s);
    },
  };
  function to(t) {
    return hn(t) ? t : new Proxy(t, sd);
  }
  class id {
    constructor(e, n, s) {
      (this.fn = e),
        (this.setter = n),
        (this._value = void 0),
        (this.dep = new mi(this)),
        (this.__v_isRef = !0),
        (this.deps = void 0),
        (this.depsTail = void 0),
        (this.flags = 16),
        (this.globalVersion = In - 1),
        (this.next = void 0),
        (this.effect = this),
        (this.__v_isReadonly = !n),
        (this.isSSR = s);
    }
    notify() {
      if (((this.flags |= 16), !(this.flags & 8) && Se !== this))
        return $r(this, !0), !0;
    }
    get value() {
      const e = this.dep.track();
      return Hr(this), e && (e.version = this.dep.version), this._value;
    }
    set value(e) {
      this.setter && this.setter(e);
    }
  }
  function rd(t, e, n = !1) {
    let s, i;
    return ie(t) ? (s = t) : ((s = t.get), (i = t.set)), new id(s, i, n);
  }
  const _s = {},
    Ss = new WeakMap();
  let tn;
  function od(t, e = !1, n = tn) {
    if (n) {
      let s = Ss.get(n);
      s || Ss.set(n, (s = [])), s.push(t);
    }
  }
  function ld(t, e, n = we) {
    const {
        immediate: s,
        deep: i,
        once: r,
        scheduler: o,
        augmentJob: l,
        call: a,
      } = n,
      u = (E) => (i ? E : it(E) || i === !1 || i === 0 ? Ft(E, 1) : Ft(E));
    let c,
      d,
      f,
      p,
      h = !1,
      m = !1;
    if (
      ($e(t)
        ? ((d = () => t.value), (h = it(t)))
        : hn(t)
        ? ((d = () => u(t)), (h = !0))
        : ne(t)
        ? ((m = !0),
          (h = t.some((E) => hn(E) || it(E))),
          (d = () =>
            t.map((E) => {
              if ($e(E)) return E.value;
              if (hn(E)) return u(E);
              if (ie(E)) return a ? a(E, 2) : E();
            })))
        : ie(t)
        ? e
          ? (d = a ? () => a(t, 2) : t)
          : (d = () => {
              if (f) {
                ht();
                try {
                  f();
                } finally {
                  gt();
                }
              }
              const E = tn;
              tn = c;
              try {
                return a ? a(t, 3, [p]) : t(p);
              } finally {
                tn = E;
              }
            })
        : (d = pt),
      e && i)
    ) {
      const E = d,
        C = i === !0 ? 1 / 0 : i;
      d = () => Ft(E(), C);
    }
    const b = Bc(),
      w = () => {
        c.stop(), b && b.active && ri(b.effects, c);
      };
    if (r && e) {
      const E = e;
      e = (...C) => {
        E(...C), w();
      };
    }
    let g = m ? new Array(t.length).fill(_s) : _s;
    const y = (E) => {
      if (!(!(c.flags & 1) || (!c.dirty && !E)))
        if (e) {
          const C = c.run();
          if (i || h || (m ? C.some((O, z) => Nt(O, g[z])) : Nt(C, g))) {
            f && f();
            const O = tn;
            tn = c;
            try {
              const z = [C, g === _s ? void 0 : m && g[0] === _s ? [] : g, p];
              (g = C), a ? a(e, 3, z) : e(...z);
            } finally {
              tn = O;
            }
          }
        } else c.run();
    };
    return (
      l && l(y),
      (c = new Rr(d)),
      (c.scheduler = o ? () => o(y, !1) : y),
      (p = (E) => od(E, !1, c)),
      (f = c.onStop =
        () => {
          const E = Ss.get(c);
          if (E) {
            if (a) a(E, 4);
            else for (const C of E) C();
            Ss.delete(c);
          }
        }),
      e ? (s ? y(!0) : (g = c.run())) : o ? o(y.bind(null, !0), !0) : c.run(),
      (w.pause = c.pause.bind(c)),
      (w.resume = c.resume.bind(c)),
      (w.stop = w),
      w
    );
  }
  function Ft(t, e = 1 / 0, n) {
    if (
      e <= 0 ||
      !Te(t) ||
      t.__v_skip ||
      ((n = n || new Map()), (n.get(t) || 0) >= e)
    )
      return t;
    if ((n.set(t, e), e--, $e(t))) Ft(t.value, e, n);
    else if (ne(t)) for (let s = 0; s < t.length; s++) Ft(t[s], e, n);
    else if (Tr(t) || fn(t))
      t.forEach((s) => {
        Ft(s, e, n);
      });
    else if (Mr(t)) {
      for (const s in t) Ft(t[s], e, n);
      for (const s of Object.getOwnPropertySymbols(t))
        Object.prototype.propertyIsEnumerable.call(t, s) && Ft(t[s], e, n);
    }
    return t;
  }
  /**
   * @vue/runtime-core v3.5.21
   * (c) 2018-present Yuxi (Evan) You and Vue contributors
   * @license MIT
   **/ const Rn = [];
  let Ei = !1;
  function Vv(t, ...e) {
    if (Ei) return;
    (Ei = !0), ht();
    const n = Rn.length ? Rn[Rn.length - 1].component : null,
      s = n && n.appContext.config.warnHandler,
      i = ad();
    if (s)
      gn(s, n, 11, [
        t +
          e
            .map((r) => {
              var o, l;
              return (l = (o = r.toString) == null ? void 0 : o.call(r)) != null
                ? l
                : JSON.stringify(r);
            })
            .join(""),
        n && n.proxy,
        i.map(({ vnode: r }) => `at <${cl(n, r.type)}>`).join(`
`),
        i,
      ]);
    else {
      const r = [`[Vue warn]: ${t}`, ...e];
      i.length &&
        r.push(
          `
`,
          ...cd(i)
        ),
        console.warn(...r);
    }
    gt(), (Ei = !1);
  }
  function ad() {
    let t = Rn[Rn.length - 1];
    if (!t) return [];
    const e = [];
    for (; t; ) {
      const n = e[0];
      n && n.vnode === t
        ? n.recurseCount++
        : e.push({ vnode: t, recurseCount: 0 });
      const s = t.component && t.component.parent;
      t = s && s.vnode;
    }
    return e;
  }
  function cd(t) {
    const e = [];
    return (
      t.forEach((n, s) => {
        e.push(
          ...(s === 0
            ? []
            : [
                `
`,
              ]),
          ...dd(n)
        );
      }),
      e
    );
  }
  function dd({ vnode: t, recurseCount: e }) {
    const n = e > 0 ? `... (${e} recursive calls)` : "",
      s = t.component ? t.component.parent == null : !1,
      i = ` at <${cl(t.component, t.type, s)}`,
      r = ">" + n;
    return t.props ? [i, ...ud(t.props), r] : [i + r];
  }
  function ud(t) {
    const e = [],
      n = Object.keys(t);
    return (
      n.slice(0, 3).forEach((s) => {
        e.push(...no(s, t[s]));
      }),
      n.length > 3 && e.push(" ..."),
      e
    );
  }
  function no(t, e, n) {
    return Ae(e)
      ? ((e = JSON.stringify(e)), n ? e : [`${t}=${e}`])
      : typeof e == "number" || typeof e == "boolean" || e == null
      ? n
        ? e
        : [`${t}=${e}`]
      : $e(e)
      ? ((e = no(t, pe(e.value), !0)), n ? e : [`${t}=Ref<`, e, ">"])
      : ie(e)
      ? [`${t}=fn${e.name ? `<${e.name}>` : ""}`]
      : ((e = pe(e)), n ? e : [`${t}=`, e]);
  }
  function gn(t, e, n, s) {
    try {
      return s ? t(...s) : t();
    } catch (i) {
      Es(i, e, n);
    }
  }
  function at(t, e, n, s) {
    if (ie(t)) {
      const i = gn(t, e, n, s);
      return (
        i &&
          Cr(i) &&
          i.catch((r) => {
            Es(r, e, n);
          }),
        i
      );
    }
    if (ne(t)) {
      const i = [];
      for (let r = 0; r < t.length; r++) i.push(at(t[r], e, n, s));
      return i;
    }
  }
  function Es(t, e, n, s = !0) {
    const i = e ? e.vnode : null,
      { errorHandler: r, throwUnhandledErrorInProduction: o } =
        (e && e.appContext.config) || we;
    if (e) {
      let l = e.parent;
      const a = e.proxy,
        u = `https://vuejs.org/error-reference/#runtime-${n}`;
      for (; l; ) {
        const c = l.ec;
        if (c) {
          for (let d = 0; d < c.length; d++) if (c[d](t, a, u) === !1) return;
        }
        l = l.parent;
      }
      if (r) {
        ht(), gn(r, null, 10, [t, a, u]), gt();
        return;
      }
    }
    fd(t, n, i, s, o);
  }
  function fd(t, e, n, s = !0, i = !1) {
    if (i) throw t;
    console.error(t);
  }
  const Ge = [];
  let mt = -1;
  const mn = [];
  let Dt = null,
    vn = 0;
  const so = Promise.resolve();
  let xs = null;
  function Bn(t) {
    const e = xs || so;
    return t ? e.then(this ? t.bind(this) : t) : e;
  }
  function pd(t) {
    let e = mt + 1,
      n = Ge.length;
    for (; e < n; ) {
      const s = (e + n) >>> 1,
        i = Ge[s],
        r = $n(i);
      r < t || (r === t && i.flags & 2) ? (e = s + 1) : (n = s);
    }
    return e;
  }
  function xi(t) {
    if (!(t.flags & 1)) {
      const e = $n(t),
        n = Ge[Ge.length - 1];
      !n || (!(t.flags & 2) && e >= $n(n))
        ? Ge.push(t)
        : Ge.splice(pd(e), 0, t),
        (t.flags |= 1),
        io();
    }
  }
  function io() {
    xs || (xs = so.then(lo));
  }
  function hd(t) {
    ne(t)
      ? mn.push(...t)
      : Dt && t.id === -1
      ? Dt.splice(vn + 1, 0, t)
      : t.flags & 1 || (mn.push(t), (t.flags |= 1)),
      io();
  }
  function ro(t, e, n = mt + 1) {
    for (; n < Ge.length; n++) {
      const s = Ge[n];
      if (s && s.flags & 2) {
        if (t && s.id !== t.uid) continue;
        Ge.splice(n, 1),
          n--,
          s.flags & 4 && (s.flags &= -2),
          s(),
          s.flags & 4 || (s.flags &= -2);
      }
    }
  }
  function oo(t) {
    if (mn.length) {
      const e = [...new Set(mn)].sort((n, s) => $n(n) - $n(s));
      if (((mn.length = 0), Dt)) {
        Dt.push(...e);
        return;
      }
      for (Dt = e, vn = 0; vn < Dt.length; vn++) {
        const n = Dt[vn];
        n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), (n.flags &= -2);
      }
      (Dt = null), (vn = 0);
    }
  }
  const $n = (t) => (t.id == null ? (t.flags & 2 ? -1 : 1 / 0) : t.id);
  function lo(t) {
    try {
      for (mt = 0; mt < Ge.length; mt++) {
        const e = Ge[mt];
        e &&
          !(e.flags & 8) &&
          (e.flags & 4 && (e.flags &= -2),
          gn(e, e.i, e.i ? 15 : 14),
          e.flags & 4 || (e.flags &= -2));
      }
    } finally {
      for (; mt < Ge.length; mt++) {
        const e = Ge[mt];
        e && (e.flags &= -2);
      }
      (mt = -1),
        (Ge.length = 0),
        oo(),
        (xs = null),
        (Ge.length || mn.length) && lo();
    }
  }
  let ct = null,
    ao = null;
  function Ts(t) {
    const e = ct;
    return (ct = t), (ao = (t && t.type.__scopeId) || null), e;
  }
  function ce(t, e = ct, n) {
    if (!e || t._n) return t;
    const s = (...i) => {
      s._d && $s(-1);
      const r = Ts(e);
      let o;
      try {
        o = t(...i);
      } finally {
        Ts(r), s._d && $s(1);
      }
      return o;
    };
    return (s._n = !0), (s._c = !0), (s._d = !0), s;
  }
  function nn(t, e, n, s) {
    const i = t.dirs,
      r = e && e.dirs;
    for (let o = 0; o < i.length; o++) {
      const l = i[o];
      r && (l.oldValue = r[o].value);
      let a = l.dir[s];
      a && (ht(), at(a, n, 8, [t.el, l, t, e]), gt());
    }
  }
  const co = Symbol("_vte"),
    uo = (t) => t.__isTeleport,
    zn = (t) => t && (t.disabled || t.disabled === ""),
    fo = (t) => t && (t.defer || t.defer === ""),
    po = (t) => typeof SVGElement != "undefined" && t instanceof SVGElement,
    ho = (t) =>
      typeof MathMLElement == "function" && t instanceof MathMLElement,
    Ti = (t, e) => {
      const n = t && t.to;
      return Ae(n) ? (e ? e(n) : null) : n;
    },
    go = {
      name: "Teleport",
      __isTeleport: !0,
      process(t, e, n, s, i, r, o, l, a, u) {
        const {
            mc: c,
            pc: d,
            pbc: f,
            o: { insert: p, querySelector: h, createText: m, createComment: b },
          } = u,
          w = zn(e.props);
        let { shapeFlag: g, children: y, dynamicChildren: E } = e;
        if (t == null) {
          const C = (e.el = m("")),
            O = (e.anchor = m(""));
          p(C, n, s), p(O, n, s);
          const z = (T, P) => {
              g & 16 &&
                (i && i.isCE && (i.ce._teleportTarget = T),
                c(y, T, P, i, r, o, l, a));
            },
            N = () => {
              const T = (e.target = Ti(e.props, h)),
                P = mo(T, e, m, p);
              T &&
                (o !== "svg" && po(T)
                  ? (o = "svg")
                  : o !== "mathml" && ho(T) && (o = "mathml"),
                w || (z(T, P), As(e, !1)));
            };
          w && (z(n, O), As(e, !0)),
            fo(e.props)
              ? ((e.el.__isMounted = !1),
                Ve(() => {
                  N(), delete e.el.__isMounted;
                }, r))
              : N();
        } else {
          if (fo(e.props) && t.el.__isMounted === !1) {
            Ve(() => {
              go.process(t, e, n, s, i, r, o, l, a, u);
            }, r);
            return;
          }
          (e.el = t.el), (e.targetStart = t.targetStart);
          const C = (e.anchor = t.anchor),
            O = (e.target = t.target),
            z = (e.targetAnchor = t.targetAnchor),
            N = zn(t.props),
            T = N ? n : O,
            P = N ? C : z;
          if (
            (o === "svg" || po(O)
              ? (o = "svg")
              : (o === "mathml" || ho(O)) && (o = "mathml"),
            E
              ? (f(t.dynamicChildren, E, T, i, r, o, l), Hi(t, e, !0))
              : a || d(t, e, T, P, i, r, o, l, !1),
            w)
          )
            N
              ? e.props &&
                t.props &&
                e.props.to !== t.props.to &&
                (e.props.to = t.props.to)
              : Cs(e, n, C, u, 1);
          else if ((e.props && e.props.to) !== (t.props && t.props.to)) {
            const $ = (e.target = Ti(e.props, h));
            $ && Cs(e, $, null, u, 0);
          } else N && Cs(e, O, z, u, 1);
          As(e, w);
        }
      },
      remove(t, e, n, { um: s, o: { remove: i } }, r) {
        const {
          shapeFlag: o,
          children: l,
          anchor: a,
          targetStart: u,
          targetAnchor: c,
          target: d,
          props: f,
        } = t;
        if ((d && (i(u), i(c)), r && i(a), o & 16)) {
          const p = r || !zn(f);
          for (let h = 0; h < l.length; h++) {
            const m = l[h];
            s(m, e, n, p, !!m.dynamicChildren);
          }
        }
      },
      move: Cs,
      hydrate: gd,
    };
  function Cs(t, e, n, { o: { insert: s }, m: i }, r = 2) {
    r === 0 && s(t.targetAnchor, e, n);
    const { el: o, anchor: l, shapeFlag: a, children: u, props: c } = t,
      d = r === 2;
    if ((d && s(o, e, n), (!d || zn(c)) && a & 16))
      for (let f = 0; f < u.length; f++) i(u[f], e, n, 2);
    d && s(l, e, n);
  }
  function gd(
    t,
    e,
    n,
    s,
    i,
    r,
    {
      o: {
        nextSibling: o,
        parentNode: l,
        querySelector: a,
        insert: u,
        createText: c,
      },
    },
    d
  ) {
    function f(m, b, w, g) {
      (b.anchor = d(o(m), b, l(m), n, s, i, r)),
        (b.targetStart = w),
        (b.targetAnchor = g);
    }
    const p = (e.target = Ti(e.props, a)),
      h = zn(e.props);
    if (p) {
      const m = p._lpa || p.firstChild;
      if (e.shapeFlag & 16)
        if (h) f(t, e, m, m && o(m));
        else {
          e.anchor = o(t);
          let b = m;
          for (; b; ) {
            if (b && b.nodeType === 8) {
              if (b.data === "teleport start anchor") e.targetStart = b;
              else if (b.data === "teleport anchor") {
                (e.targetAnchor = b),
                  (p._lpa = e.targetAnchor && o(e.targetAnchor));
                break;
              }
            }
            b = o(b);
          }
          e.targetAnchor || mo(p, e, c, u), d(m && o(m), e, p, n, s, i, r);
        }
      As(e, h);
    } else h && e.shapeFlag & 16 && f(t, e, t, o(t));
    return e.anchor && o(e.anchor);
  }
  const md = go;
  function As(t, e) {
    const n = t.ctx;
    if (n && n.ut) {
      let s, i;
      for (
        e
          ? ((s = t.el), (i = t.anchor))
          : ((s = t.targetStart), (i = t.targetAnchor));
        s && s !== i;

      )
        s.nodeType === 1 && s.setAttribute("data-v-owner", n.uid),
          (s = s.nextSibling);
      n.ut();
    }
  }
  function mo(t, e, n, s) {
    const i = (e.targetStart = n("")),
      r = (e.targetAnchor = n(""));
    return (i[co] = r), t && (s(i, t), s(r, t)), r;
  }
  const Pt = Symbol("_leaveCb"),
    Ms = Symbol("_enterCb");
  function vd() {
    const t = {
      isMounted: !1,
      isLeaving: !1,
      isUnmounting: !1,
      leavingVNodes: new Map(),
    };
    return (
      It(() => {
        t.isMounted = !0;
      }),
      Gt(() => {
        t.isUnmounting = !0;
      }),
      t
    );
  }
  const rt = [Function, Array],
    vo = {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      onBeforeEnter: rt,
      onEnter: rt,
      onAfterEnter: rt,
      onEnterCancelled: rt,
      onBeforeLeave: rt,
      onLeave: rt,
      onAfterLeave: rt,
      onLeaveCancelled: rt,
      onBeforeAppear: rt,
      onAppear: rt,
      onAfterAppear: rt,
      onAppearCancelled: rt,
    },
    yo = (t) => {
      const e = t.subTree;
      return e.component ? yo(e.component) : e;
    },
    yd = {
      name: "BaseTransition",
      props: vo,
      setup(t, { slots: e }) {
        const n = sl(),
          s = vd();
        return () => {
          const i = e.default && So(e.default(), !0);
          if (!i || !i.length) return;
          const r = bo(i),
            o = pe(t),
            { mode: l } = o;
          if (s.isLeaving) return Ai(r);
          const a = _o(r);
          if (!a) return Ai(r);
          let u = Ci(a, o, s, n, (d) => (u = d));
          a.type !== Ue && Nn(a, u);
          let c = n.subTree && _o(n.subTree);
          if (c && c.type !== Ue && !rn(c, a) && yo(n).type !== Ue) {
            let d = Ci(c, o, s, n);
            if ((Nn(c, d), l === "out-in" && a.type !== Ue))
              return (
                (s.isLeaving = !0),
                (d.afterLeave = () => {
                  (s.isLeaving = !1),
                    n.job.flags & 8 || n.update(),
                    delete d.afterLeave,
                    (c = void 0);
                }),
                Ai(r)
              );
            l === "in-out" && a.type !== Ue
              ? (d.delayLeave = (f, p, h) => {
                  const m = wo(s, c);
                  (m[String(c.key)] = c),
                    (f[Pt] = () => {
                      p(),
                        (f[Pt] = void 0),
                        delete u.delayedLeave,
                        (c = void 0);
                    }),
                    (u.delayedLeave = () => {
                      h(), delete u.delayedLeave, (c = void 0);
                    });
                })
              : (c = void 0);
          } else c && (c = void 0);
          return r;
        };
      },
    };
  function bo(t) {
    let e = t[0];
    if (t.length > 1) {
      for (const n of t)
        if (n.type !== Ue) {
          e = n;
          break;
        }
    }
    return e;
  }
  const bd = yd;
  function wo(t, e) {
    const { leavingVNodes: n } = t;
    let s = n.get(e.type);
    return s || ((s = Object.create(null)), n.set(e.type, s)), s;
  }
  function Ci(t, e, n, s, i) {
    const {
        appear: r,
        mode: o,
        persisted: l = !1,
        onBeforeEnter: a,
        onEnter: u,
        onAfterEnter: c,
        onEnterCancelled: d,
        onBeforeLeave: f,
        onLeave: p,
        onAfterLeave: h,
        onLeaveCancelled: m,
        onBeforeAppear: b,
        onAppear: w,
        onAfterAppear: g,
        onAppearCancelled: y,
      } = e,
      E = String(t.key),
      C = wo(n, t),
      O = (T, P) => {
        T && at(T, s, 9, P);
      },
      z = (T, P) => {
        const $ = P[1];
        O(T, P),
          ne(T) ? T.every((R) => R.length <= 1) && $() : T.length <= 1 && $();
      },
      N = {
        mode: o,
        persisted: l,
        beforeEnter(T) {
          let P = a;
          if (!n.isMounted)
            if (r) P = b || a;
            else return;
          T[Pt] && T[Pt](!0);
          const $ = C[E];
          $ && rn(t, $) && $.el[Pt] && $.el[Pt](), O(P, [T]);
        },
        enter(T) {
          let P = u,
            $ = c,
            R = d;
          if (!n.isMounted)
            if (r) (P = w || u), ($ = g || c), (R = y || d);
            else return;
          let G = !1;
          const ee = (T[Ms] = (re) => {
            G ||
              ((G = !0),
              re ? O(R, [T]) : O($, [T]),
              N.delayedLeave && N.delayedLeave(),
              (T[Ms] = void 0));
          });
          P ? z(P, [T, ee]) : ee();
        },
        leave(T, P) {
          const $ = String(t.key);
          if ((T[Ms] && T[Ms](!0), n.isUnmounting)) return P();
          O(f, [T]);
          let R = !1;
          const G = (T[Pt] = (ee) => {
            R ||
              ((R = !0),
              P(),
              ee ? O(m, [T]) : O(h, [T]),
              (T[Pt] = void 0),
              C[$] === t && delete C[$]);
          });
          (C[$] = t), p ? z(p, [T, G]) : G();
        },
        clone(T) {
          const P = Ci(T, e, n, s, i);
          return i && i(P), P;
        },
      };
    return N;
  }
  function Ai(t) {
    if (Ls(t)) return (t = Vt(t)), (t.children = null), t;
  }
  function _o(t) {
    if (!Ls(t)) return uo(t.type) && t.children ? bo(t.children) : t;
    if (t.component) return t.component.subTree;
    const { shapeFlag: e, children: n } = t;
    if (n) {
      if (e & 16) return n[0];
      if (e & 32 && ie(n.default)) return n.default();
    }
  }
  function Nn(t, e) {
    t.shapeFlag & 6 && t.component
      ? ((t.transition = e), Nn(t.component.subTree, e))
      : t.shapeFlag & 128
      ? ((t.ssContent.transition = e.clone(t.ssContent)),
        (t.ssFallback.transition = e.clone(t.ssFallback)))
      : (t.transition = e);
  }
  function So(t, e = !1, n) {
    let s = [],
      i = 0;
    for (let r = 0; r < t.length; r++) {
      let o = t[r];
      const l =
        n == null ? o.key : String(n) + String(o.key != null ? o.key : r);
      o.type === he
        ? (o.patchFlag & 128 && i++, (s = s.concat(So(o.children, e, l))))
        : (e || o.type !== Ue) && s.push(l != null ? Vt(o, { key: l }) : o);
    }
    if (i > 1) for (let r = 0; r < s.length; r++) s[r].patchFlag = -2;
    return s;
  }
  function Mi(t, e) {
    return ie(t) ? ke({ name: t.name }, e, { setup: t }) : t;
  }
  function Eo(t) {
    t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
  }
  const Ps = new WeakMap();
  function Hn(t, e, n, s, i = !1) {
    if (ne(t)) {
      t.forEach((h, m) => Hn(h, e && (ne(e) ? e[m] : e), n, s, i));
      return;
    }
    if (Fn(s) && !i) {
      s.shapeFlag & 512 &&
        s.type.__asyncResolved &&
        s.component.subTree.component &&
        Hn(t, e, n, s.component.subTree);
      return;
    }
    const r = s.shapeFlag & 4 ? Gi(s.component) : s.el,
      o = i ? null : r,
      { i: l, r: a } = t,
      u = e && e.r,
      c = l.refs === we ? (l.refs = {}) : l.refs,
      d = l.setupState,
      f = pe(d),
      p = d === we ? xr : (h) => me(f, h);
    if (u != null && u !== a) {
      if ((xo(e), Ae(u))) (c[u] = null), p(u) && (d[u] = null);
      else if ($e(u)) {
        u.value = null;
        const h = e;
        h.k && (c[h.k] = null);
      }
    }
    if (ie(a)) gn(a, l, 12, [o, c]);
    else {
      const h = Ae(a),
        m = $e(a);
      if (h || m) {
        const b = () => {
          if (t.f) {
            const w = h ? (p(a) ? d[a] : c[a]) : a.value;
            if (i) ne(w) && ri(w, r);
            else if (ne(w)) w.includes(r) || w.push(r);
            else if (h) (c[a] = [r]), p(a) && (d[a] = c[a]);
            else {
              const g = [r];
              (a.value = g), t.k && (c[t.k] = g);
            }
          } else
            h
              ? ((c[a] = o), p(a) && (d[a] = o))
              : m && ((a.value = o), t.k && (c[t.k] = o));
        };
        if (o) {
          const w = () => {
            b(), Ps.delete(t);
          };
          (w.id = -1), Ps.set(t, w), Ve(w, n);
        } else xo(t), b();
      }
    }
  }
  function xo(t) {
    const e = Ps.get(t);
    e && ((e.flags |= 8), Ps.delete(t));
  }
  ps().requestIdleCallback, ps().cancelIdleCallback;
  const Fn = (t) => !!t.type.__asyncLoader,
    Ls = (t) => t.type.__isKeepAlive;
  function wd(t, e) {
    To(t, "a", e);
  }
  function _d(t, e) {
    To(t, "da", e);
  }
  function To(t, e, n = He) {
    const s =
      t.__wdc ||
      (t.__wdc = () => {
        let i = n;
        for (; i; ) {
          if (i.isDeactivated) return;
          i = i.parent;
        }
        return t();
      });
    if ((Is(e, s, n), n)) {
      let i = n.parent;
      for (; i && i.parent; )
        Ls(i.parent.vnode) && Sd(s, e, n, i), (i = i.parent);
    }
  }
  function Sd(t, e, n, s) {
    const i = Is(e, t, s, !0);
    Li(() => {
      ri(s[e], i);
    }, n);
  }
  function Is(t, e, n = He, s = !1) {
    if (n) {
      const i = n[t] || (n[t] = []),
        r =
          e.__weh ||
          (e.__weh = (...o) => {
            ht();
            const l = Wn(n),
              a = at(e, n, t, o);
            return l(), gt(), a;
          });
      return s ? i.unshift(r) : i.push(r), r;
    }
  }
  const Lt =
      (t) =>
      (e, n = He) => {
        (!qn || t === "sp") && Is(t, (...s) => e(...s), n);
      },
    Ed = Lt("bm"),
    It = Lt("m"),
    Co = Lt("bu"),
    Pi = Lt("u"),
    Gt = Lt("bum"),
    Li = Lt("um"),
    xd = Lt("sp"),
    Td = Lt("rtg"),
    Cd = Lt("rtc");
  function Ad(t, e = He) {
    Is("ec", t, e);
  }
  const Ao = "components";
  function yn(t, e) {
    return Po(Ao, t, !0, e) || t;
  }
  const Mo = Symbol.for("v-ndc");
  function Md(t) {
    return Ae(t) ? Po(Ao, t, !1) || t : t || Mo;
  }
  function Po(t, e, n = !0, s = !1) {
    const i = ct || He;
    if (i) {
      const r = i.type;
      {
        const l = al(r, !1);
        if (l && (l === e || l === st(e) || l === fs(st(e)))) return r;
      }
      const o = Lo(i[t] || r[t], e) || Lo(i.appContext[t], e);
      return !o && s ? r : o;
    }
  }
  function Lo(t, e) {
    return t && (t[e] || t[st(e)] || t[fs(st(e))]);
  }
  function Ye(t, e, n, s) {
    let i;
    const r = n,
      o = ne(t);
    if (o || Ae(t)) {
      const l = o && hn(t);
      let a = !1,
        u = !1;
      l && ((a = !it(t)), (u = Ht(t)), (t = hs(t))), (i = new Array(t.length));
      for (let c = 0, d = t.length; c < d; c++)
        i[c] = e(a ? (u ? ws(Be(t[c])) : Be(t[c])) : t[c], c, void 0, r);
    } else if (typeof t == "number") {
      i = new Array(t);
      for (let l = 0; l < t; l++) i[l] = e(l + 1, l, void 0, r);
    } else if (Te(t))
      if (t[Symbol.iterator]) i = Array.from(t, (l, a) => e(l, a, void 0, r));
      else {
        const l = Object.keys(t);
        i = new Array(l.length);
        for (let a = 0, u = l.length; a < u; a++) {
          const c = l[a];
          i[a] = e(t[c], c, a, r);
        }
      }
    else i = [];
    return i;
  }
  const Ii = (t) => (t ? (rl(t) ? Gi(t) : Ii(t.parent)) : null),
    Dn = ke(Object.create(null), {
      $: (t) => t,
      $el: (t) => t.vnode.el,
      $data: (t) => t.data,
      $props: (t) => t.props,
      $attrs: (t) => t.attrs,
      $slots: (t) => t.slots,
      $refs: (t) => t.refs,
      $parent: (t) => Ii(t.parent),
      $root: (t) => Ii(t.root),
      $host: (t) => t.ce,
      $emit: (t) => t.emit,
      $options: (t) => Ro(t),
      $forceUpdate: (t) =>
        t.f ||
        (t.f = () => {
          xi(t.update);
        }),
      $nextTick: (t) => t.n || (t.n = Bn.bind(t.proxy)),
      $watch: (t) => Yd.bind(t),
    }),
    Oi = (t, e) => t !== we && !t.__isScriptSetup && me(t, e),
    Pd = {
      get({ _: t }, e) {
        if (e === "__v_skip") return !0;
        const {
          ctx: n,
          setupState: s,
          data: i,
          props: r,
          accessCache: o,
          type: l,
          appContext: a,
        } = t;
        let u;
        if (e[0] !== "$") {
          const p = o[e];
          if (p !== void 0)
            switch (p) {
              case 1:
                return s[e];
              case 2:
                return i[e];
              case 4:
                return n[e];
              case 3:
                return r[e];
            }
          else {
            if (Oi(s, e)) return (o[e] = 1), s[e];
            if (i !== we && me(i, e)) return (o[e] = 2), i[e];
            if ((u = t.propsOptions[0]) && me(u, e)) return (o[e] = 3), r[e];
            if (n !== we && me(n, e)) return (o[e] = 4), n[e];
            ki && (o[e] = 0);
          }
        }
        const c = Dn[e];
        let d, f;
        if (c) return e === "$attrs" && Ne(t.attrs, "get", ""), c(t);
        if ((d = l.__cssModules) && (d = d[e])) return d;
        if (n !== we && me(n, e)) return (o[e] = 4), n[e];
        if (((f = a.config.globalProperties), me(f, e))) return f[e];
      },
      set({ _: t }, e, n) {
        const { data: s, setupState: i, ctx: r } = t;
        return Oi(i, e)
          ? ((i[e] = n), !0)
          : s !== we && me(s, e)
          ? ((s[e] = n), !0)
          : me(t.props, e) || (e[0] === "$" && e.slice(1) in t)
          ? !1
          : ((r[e] = n), !0);
      },
      has(
        {
          _: {
            data: t,
            setupState: e,
            accessCache: n,
            ctx: s,
            appContext: i,
            propsOptions: r,
            type: o,
          },
        },
        l
      ) {
        let a, u;
        return !!(
          n[l] ||
          (t !== we && l[0] !== "$" && me(t, l)) ||
          Oi(e, l) ||
          ((a = r[0]) && me(a, l)) ||
          me(s, l) ||
          me(Dn, l) ||
          me(i.config.globalProperties, l) ||
          ((u = o.__cssModules) && u[l])
        );
      },
      defineProperty(t, e, n) {
        return (
          n.get != null
            ? (t._.accessCache[e] = 0)
            : me(n, "value") && this.set(t, e, n.value, null),
          Reflect.defineProperty(t, e, n)
        );
      },
    };
  function Io(t) {
    return ne(t) ? t.reduce((e, n) => ((e[n] = null), e), {}) : t;
  }
  let ki = !0;
  function Ld(t) {
    const e = Ro(t),
      n = t.proxy,
      s = t.ctx;
    (ki = !1), e.beforeCreate && Oo(e.beforeCreate, t, "bc");
    const {
      data: i,
      computed: r,
      methods: o,
      watch: l,
      provide: a,
      inject: u,
      created: c,
      beforeMount: d,
      mounted: f,
      beforeUpdate: p,
      updated: h,
      activated: m,
      deactivated: b,
      beforeDestroy: w,
      beforeUnmount: g,
      destroyed: y,
      unmounted: E,
      render: C,
      renderTracked: O,
      renderTriggered: z,
      errorCaptured: N,
      serverPrefetch: T,
      expose: P,
      inheritAttrs: $,
      components: R,
      directives: G,
      filters: ee,
    } = e;
    if ((u && Id(u, s, null), o))
      for (const A in o) {
        const M = o[A];
        ie(M) && (s[A] = M.bind(n));
      }
    if (i) {
      const A = i.call(n, n);
      Te(A) && (t.data = ys(A));
    }
    if (((ki = !0), r))
      for (const A in r) {
        const M = r[A],
          Y = ie(M) ? M.bind(n, n) : ie(M.get) ? M.get.bind(n, n) : pt,
          le = !ie(M) && ie(M.set) ? M.set.bind(n) : pt,
          Ce = ze({ get: Y, set: le });
        Object.defineProperty(s, A, {
          enumerable: !0,
          configurable: !0,
          get: () => Ce.value,
          set: (Ee) => (Ce.value = Ee),
        });
      }
    if (l) for (const A in l) ko(l[A], s, n, A);
    if (a) {
      const A = ie(a) ? a.call(n) : a;
      Reflect.ownKeys(A).forEach((M) => {
        wn(M, A[M]);
      });
    }
    c && Oo(c, t, "c");
    function W(A, M) {
      ne(M) ? M.forEach((Y) => A(Y.bind(n))) : M && A(M.bind(n));
    }
    if (
      (W(Ed, d),
      W(It, f),
      W(Co, p),
      W(Pi, h),
      W(wd, m),
      W(_d, b),
      W(Ad, N),
      W(Cd, O),
      W(Td, z),
      W(Gt, g),
      W(Li, E),
      W(xd, T),
      ne(P))
    )
      if (P.length) {
        const A = t.exposed || (t.exposed = {});
        P.forEach((M) => {
          Object.defineProperty(A, M, {
            get: () => n[M],
            set: (Y) => (n[M] = Y),
            enumerable: !0,
          });
        });
      } else t.exposed || (t.exposed = {});
    C && t.render === pt && (t.render = C),
      $ != null && (t.inheritAttrs = $),
      R && (t.components = R),
      G && (t.directives = G),
      T && Eo(t);
  }
  function Id(t, e, n = pt) {
    ne(t) && (t = Ri(t));
    for (const s in t) {
      const i = t[s];
      let r;
      Te(i)
        ? "default" in i
          ? (r = dt(i.from || s, i.default, !0))
          : (r = dt(i.from || s))
        : (r = dt(i)),
        $e(r)
          ? Object.defineProperty(e, s, {
              enumerable: !0,
              configurable: !0,
              get: () => r.value,
              set: (o) => (r.value = o),
            })
          : (e[s] = r);
    }
  }
  function Oo(t, e, n) {
    at(ne(t) ? t.map((s) => s.bind(e.proxy)) : t.bind(e.proxy), e, n);
  }
  function ko(t, e, n, s) {
    let i = s.includes(".") ? Qo(n, s) : () => n[s];
    if (Ae(t)) {
      const r = e[t];
      ie(r) && jt(i, r);
    } else if (ie(t)) jt(i, t.bind(n));
    else if (Te(t))
      if (ne(t)) t.forEach((r) => ko(r, e, n, s));
      else {
        const r = ie(t.handler) ? t.handler.bind(n) : e[t.handler];
        ie(r) && jt(i, r, t);
      }
  }
  function Ro(t) {
    const e = t.type,
      { mixins: n, extends: s } = e,
      {
        mixins: i,
        optionsCache: r,
        config: { optionMergeStrategies: o },
      } = t.appContext,
      l = r.get(e);
    let a;
    return (
      l
        ? (a = l)
        : !i.length && !n && !s
        ? (a = e)
        : ((a = {}),
          i.length && i.forEach((u) => Os(a, u, o, !0)),
          Os(a, e, o)),
      Te(e) && r.set(e, a),
      a
    );
  }
  function Os(t, e, n, s = !1) {
    const { mixins: i, extends: r } = e;
    r && Os(t, r, n, !0), i && i.forEach((o) => Os(t, o, n, !0));
    for (const o in e)
      if (!(s && o === "expose")) {
        const l = Od[o] || (n && n[o]);
        t[o] = l ? l(t[o], e[o]) : e[o];
      }
    return t;
  }
  const Od = {
    data: Bo,
    props: $o,
    emits: $o,
    methods: Gn,
    computed: Gn,
    beforeCreate: je,
    created: je,
    beforeMount: je,
    mounted: je,
    beforeUpdate: je,
    updated: je,
    beforeDestroy: je,
    beforeUnmount: je,
    destroyed: je,
    unmounted: je,
    activated: je,
    deactivated: je,
    errorCaptured: je,
    serverPrefetch: je,
    components: Gn,
    directives: Gn,
    watch: Rd,
    provide: Bo,
    inject: kd,
  };
  function Bo(t, e) {
    return e
      ? t
        ? function () {
            return ke(
              ie(t) ? t.call(this, this) : t,
              ie(e) ? e.call(this, this) : e
            );
          }
        : e
      : t;
  }
  function kd(t, e) {
    return Gn(Ri(t), Ri(e));
  }
  function Ri(t) {
    if (ne(t)) {
      const e = {};
      for (let n = 0; n < t.length; n++) e[t[n]] = t[n];
      return e;
    }
    return t;
  }
  function je(t, e) {
    return t ? [...new Set([].concat(t, e))] : e;
  }
  function Gn(t, e) {
    return t ? ke(Object.create(null), t, e) : e;
  }
  function $o(t, e) {
    return t
      ? ne(t) && ne(e)
        ? [...new Set([...t, ...e])]
        : ke(Object.create(null), Io(t), Io(e != null ? e : {}))
      : e;
  }
  function Rd(t, e) {
    if (!t) return e;
    if (!e) return t;
    const n = ke(Object.create(null), t);
    for (const s in e) n[s] = je(t[s], e[s]);
    return n;
  }
  function zo() {
    return {
      app: null,
      config: {
        isNativeTag: xr,
        performance: !1,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {},
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap(),
    };
  }
  let Bd = 0;
  function $d(t, e) {
    return function (s, i = null) {
      ie(s) || (s = ke({}, s)), i != null && !Te(i) && (i = null);
      const r = zo(),
        o = new WeakSet(),
        l = [];
      let a = !1;
      const u = (r.app = {
        _uid: Bd++,
        _component: s,
        _props: i,
        _container: null,
        _context: r,
        _instance: null,
        version: yu,
        get config() {
          return r.config;
        },
        set config(c) {},
        use(c, ...d) {
          return (
            o.has(c) ||
              (c && ie(c.install)
                ? (o.add(c), c.install(u, ...d))
                : ie(c) && (o.add(c), c(u, ...d))),
            u
          );
        },
        mixin(c) {
          return r.mixins.includes(c) || r.mixins.push(c), u;
        },
        component(c, d) {
          return d ? ((r.components[c] = d), u) : r.components[c];
        },
        directive(c, d) {
          return d ? ((r.directives[c] = d), u) : r.directives[c];
        },
        mount(c, d, f) {
          if (!a) {
            const p = u._ceVNode || Z(s, i);
            return (
              (p.appContext = r),
              f === !0 ? (f = "svg") : f === !1 && (f = void 0),
              t(p, c, f),
              (a = !0),
              (u._container = c),
              (c.__vue_app__ = u),
              Gi(p.component)
            );
          }
        },
        onUnmount(c) {
          l.push(c);
        },
        unmount() {
          a &&
            (at(l, u._instance, 16),
            t(null, u._container),
            delete u._container.__vue_app__);
        },
        provide(c, d) {
          return (r.provides[c] = d), u;
        },
        runWithContext(c) {
          const d = bn;
          bn = u;
          try {
            return c();
          } finally {
            bn = d;
          }
        },
      });
      return u;
    };
  }
  let bn = null;
  function wn(t, e) {
    if (He) {
      let n = He.provides;
      const s = He.parent && He.parent.provides;
      s === n && (n = He.provides = Object.create(s)), (n[t] = e);
    }
  }
  function dt(t, e, n = !1) {
    const s = sl();
    if (s || bn) {
      let i = bn
        ? bn._context.provides
        : s
        ? s.parent == null || s.ce
          ? s.vnode.appContext && s.vnode.appContext.provides
          : s.parent.provides
        : void 0;
      if (i && t in i) return i[t];
      if (arguments.length > 1) return n && ie(e) ? e.call(s && s.proxy) : e;
    }
  }
  const No = {},
    Ho = () => Object.create(No),
    Fo = (t) => Object.getPrototypeOf(t) === No;
  function zd(t, e, n, s = !1) {
    const i = {},
      r = Ho();
    (t.propsDefaults = Object.create(null)), Do(t, e, i, r);
    for (const o in t.propsOptions[0]) o in i || (i[o] = void 0);
    n
      ? (t.props = s ? i : Jr(i))
      : t.type.props
      ? (t.props = i)
      : (t.props = r),
      (t.attrs = r);
  }
  function Nd(t, e, n, s) {
    const {
        props: i,
        attrs: r,
        vnode: { patchFlag: o },
      } = t,
      l = pe(i),
      [a] = t.propsOptions;
    let u = !1;
    if ((s || o > 0) && !(o & 16)) {
      if (o & 8) {
        const c = t.vnode.dynamicProps;
        for (let d = 0; d < c.length; d++) {
          let f = c[d];
          if (ks(t.emitsOptions, f)) continue;
          const p = e[f];
          if (a)
            if (me(r, f)) p !== r[f] && ((r[f] = p), (u = !0));
            else {
              const h = st(f);
              i[h] = Bi(a, l, h, p, t, !1);
            }
          else p !== r[f] && ((r[f] = p), (u = !0));
        }
      }
    } else {
      Do(t, e, i, r) && (u = !0);
      let c;
      for (const d in l)
        (!e || (!me(e, d) && ((c = Zt(d)) === d || !me(e, c)))) &&
          (a
            ? n &&
              (n[d] !== void 0 || n[c] !== void 0) &&
              (i[d] = Bi(a, l, d, void 0, t, !0))
            : delete i[d]);
      if (r !== l)
        for (const d in r) (!e || !me(e, d)) && (delete r[d], (u = !0));
    }
    u && At(t.attrs, "set", "");
  }
  function Do(t, e, n, s) {
    const [i, r] = t.propsOptions;
    let o = !1,
      l;
    if (e)
      for (let a in e) {
        if (Mn(a)) continue;
        const u = e[a];
        let c;
        i && me(i, (c = st(a)))
          ? !r || !r.includes(c)
            ? (n[c] = u)
            : ((l || (l = {}))[c] = u)
          : ks(t.emitsOptions, a) ||
            ((!(a in s) || u !== s[a]) && ((s[a] = u), (o = !0)));
      }
    if (r) {
      const a = pe(n),
        u = l || we;
      for (let c = 0; c < r.length; c++) {
        const d = r[c];
        n[d] = Bi(i, a, d, u[d], t, !me(u, d));
      }
    }
    return o;
  }
  function Bi(t, e, n, s, i, r) {
    const o = t[n];
    if (o != null) {
      const l = me(o, "default");
      if (l && s === void 0) {
        const a = o.default;
        if (o.type !== Function && !o.skipFactory && ie(a)) {
          const { propsDefaults: u } = i;
          if (n in u) s = u[n];
          else {
            const c = Wn(i);
            (s = u[n] = a.call(null, e)), c();
          }
        } else s = a;
        i.ce && i.ce._setProp(n, s);
      }
      o[0] &&
        (r && !l ? (s = !1) : o[1] && (s === "" || s === Zt(n)) && (s = !0));
    }
    return s;
  }
  const Hd = new WeakMap();
  function Go(t, e, n = !1) {
    const s = n ? Hd : e.propsCache,
      i = s.get(t);
    if (i) return i;
    const r = t.props,
      o = {},
      l = [];
    let a = !1;
    if (!ie(t)) {
      const c = (d) => {
        a = !0;
        const [f, p] = Go(d, e, !0);
        ke(o, f), p && l.push(...p);
      };
      !n && e.mixins.length && e.mixins.forEach(c),
        t.extends && c(t.extends),
        t.mixins && t.mixins.forEach(c);
    }
    if (!r && !a) return Te(t) && s.set(t, un), un;
    if (ne(r))
      for (let c = 0; c < r.length; c++) {
        const d = st(r[c]);
        jo(d) && (o[d] = we);
      }
    else if (r)
      for (const c in r) {
        const d = st(c);
        if (jo(d)) {
          const f = r[c],
            p = (o[d] = ne(f) || ie(f) ? { type: f } : ke({}, f)),
            h = p.type;
          let m = !1,
            b = !0;
          if (ne(h))
            for (let w = 0; w < h.length; ++w) {
              const g = h[w],
                y = ie(g) && g.name;
              if (y === "Boolean") {
                m = !0;
                break;
              } else y === "String" && (b = !1);
            }
          else m = ie(h) && h.name === "Boolean";
          (p[0] = m), (p[1] = b), (m || me(p, "default")) && l.push(d);
        }
      }
    const u = [o, l];
    return Te(t) && s.set(t, u), u;
  }
  function jo(t) {
    return t[0] !== "$" && !Mn(t);
  }
  const $i = (t) => t === "_" || t === "_ctx" || t === "$stable",
    zi = (t) => (ne(t) ? t.map(vt) : [vt(t)]),
    Fd = (t, e, n) => {
      if (e._n) return e;
      const s = ce((...i) => zi(e(...i)), n);
      return (s._c = !1), s;
    },
    Vo = (t, e, n) => {
      const s = t._ctx;
      for (const i in t) {
        if ($i(i)) continue;
        const r = t[i];
        if (ie(r)) e[i] = Fd(i, r, s);
        else if (r != null) {
          const o = zi(r);
          e[i] = () => o;
        }
      }
    },
    Uo = (t, e) => {
      const n = zi(e);
      t.slots.default = () => n;
    },
    Wo = (t, e, n) => {
      for (const s in e) (n || !$i(s)) && (t[s] = e[s]);
    },
    Dd = (t, e, n) => {
      const s = (t.slots = Ho());
      if (t.vnode.shapeFlag & 32) {
        const i = e._;
        i ? (Wo(s, e, n), n && Pr(s, "_", i, !0)) : Vo(e, s);
      } else e && Uo(t, e);
    },
    Gd = (t, e, n) => {
      const { vnode: s, slots: i } = t;
      let r = !0,
        o = we;
      if (s.shapeFlag & 32) {
        const l = e._;
        l
          ? n && l === 1
            ? (r = !1)
            : Wo(i, e, n)
          : ((r = !e.$stable), Vo(e, i)),
          (o = e);
      } else e && (Uo(t, e), (o = { default: 1 }));
      if (r) for (const l in i) !$i(l) && o[l] == null && delete i[l];
    },
    Ve = su;
  function jd(t) {
    return Vd(t);
  }
  function Vd(t, e) {
    const n = ps();
    n.__VUE__ = !0;
    const {
        insert: s,
        remove: i,
        patchProp: r,
        createElement: o,
        createText: l,
        createComment: a,
        setText: u,
        setElementText: c,
        parentNode: d,
        nextSibling: f,
        setScopeId: p = pt,
        insertStaticContent: h,
      } = t,
      m = (
        _,
        S,
        x,
        I = null,
        B = null,
        L = null,
        j = void 0,
        D = null,
        F = !!S.dynamicChildren
      ) => {
        if (_ === S) return;
        _ && !rn(_, S) && ((I = k(_)), Ee(_, B, L, !0), (_ = null)),
          S.patchFlag === -2 && ((F = !1), (S.dynamicChildren = null));
        const { type: H, ref: J, shapeFlag: U } = S;
        switch (H) {
          case Rs:
            b(_, S, x, I);
            break;
          case Ue:
            w(_, S, x, I);
            break;
          case Bs:
            _ == null && g(S, x, I, j);
            break;
          case he:
            R(_, S, x, I, B, L, j, D, F);
            break;
          default:
            U & 1
              ? C(_, S, x, I, B, L, j, D, F)
              : U & 6
              ? G(_, S, x, I, B, L, j, D, F)
              : (U & 64 || U & 128) && H.process(_, S, x, I, B, L, j, D, F, Q);
        }
        J != null && B
          ? Hn(J, _ && _.ref, L, S || _, !S)
          : J == null && _ && _.ref != null && Hn(_.ref, null, L, _, !0);
      },
      b = (_, S, x, I) => {
        if (_ == null) s((S.el = l(S.children)), x, I);
        else {
          const B = (S.el = _.el);
          S.children !== _.children && u(B, S.children);
        }
      },
      w = (_, S, x, I) => {
        _ == null ? s((S.el = a(S.children || "")), x, I) : (S.el = _.el);
      },
      g = (_, S, x, I) => {
        [_.el, _.anchor] = h(_.children, S, x, I, _.el, _.anchor);
      },
      y = ({ el: _, anchor: S }, x, I) => {
        let B;
        for (; _ && _ !== S; ) (B = f(_)), s(_, x, I), (_ = B);
        s(S, x, I);
      },
      E = ({ el: _, anchor: S }) => {
        let x;
        for (; _ && _ !== S; ) (x = f(_)), i(_), (_ = x);
        i(S);
      },
      C = (_, S, x, I, B, L, j, D, F) => {
        S.type === "svg" ? (j = "svg") : S.type === "math" && (j = "mathml"),
          _ == null ? O(S, x, I, B, L, j, D, F) : T(_, S, B, L, j, D, F);
      },
      O = (_, S, x, I, B, L, j, D) => {
        let F, H;
        const { props: J, shapeFlag: U, transition: X, dirs: se } = _;
        if (
          ((F = _.el = o(_.type, L, J && J.is, J)),
          U & 8
            ? c(F, _.children)
            : U & 16 && N(_.children, F, null, I, B, Ni(_, L), j, D),
          se && nn(_, null, I, "created"),
          z(F, _, _.scopeId, j, I),
          J)
        ) {
          for (const xe in J)
            xe !== "value" && !Mn(xe) && r(F, xe, null, J[xe], L, I);
          "value" in J && r(F, "value", null, J.value, L),
            (H = J.onVnodeBeforeMount) && yt(H, I, _);
        }
        se && nn(_, null, I, "beforeMount");
        const fe = Ud(B, X);
        fe && X.beforeEnter(F),
          s(F, S, x),
          ((H = J && J.onVnodeMounted) || fe || se) &&
            Ve(() => {
              H && yt(H, I, _),
                fe && X.enter(F),
                se && nn(_, null, I, "mounted");
            }, B);
      },
      z = (_, S, x, I, B) => {
        if ((x && p(_, x), I)) for (let L = 0; L < I.length; L++) p(_, I[L]);
        if (B) {
          let L = B.subTree;
          if (
            S === L ||
            (el(L.type) && (L.ssContent === S || L.ssFallback === S))
          ) {
            const j = B.vnode;
            z(_, j, j.scopeId, j.slotScopeIds, B.parent);
          }
        }
      },
      N = (_, S, x, I, B, L, j, D, F = 0) => {
        for (let H = F; H < _.length; H++) {
          const J = (_[H] = D ? Wt(_[H]) : vt(_[H]));
          m(null, J, S, x, I, B, L, j, D);
        }
      },
      T = (_, S, x, I, B, L, j) => {
        const D = (S.el = _.el);
        let { patchFlag: F, dynamicChildren: H, dirs: J } = S;
        F |= _.patchFlag & 16;
        const U = _.props || we,
          X = S.props || we;
        let se;
        if (
          (x && sn(x, !1),
          (se = X.onVnodeBeforeUpdate) && yt(se, x, S, _),
          J && nn(S, _, x, "beforeUpdate"),
          x && sn(x, !0),
          ((U.innerHTML && X.innerHTML == null) ||
            (U.textContent && X.textContent == null)) &&
            c(D, ""),
          H
            ? P(_.dynamicChildren, H, D, x, I, Ni(S, B), L)
            : j || M(_, S, D, null, x, I, Ni(S, B), L, !1),
          F > 0)
        ) {
          if (F & 16) $(D, U, X, x, B);
          else if (
            (F & 2 && U.class !== X.class && r(D, "class", null, X.class, B),
            F & 4 && r(D, "style", U.style, X.style, B),
            F & 8)
          ) {
            const fe = S.dynamicProps;
            for (let xe = 0; xe < fe.length; xe++) {
              const ye = fe[xe],
                Xe = U[ye],
                Je = X[ye];
              (Je !== Xe || ye === "value") && r(D, ye, Xe, Je, B, x);
            }
          }
          F & 1 && _.children !== S.children && c(D, S.children);
        } else !j && H == null && $(D, U, X, x, B);
        ((se = X.onVnodeUpdated) || J) &&
          Ve(() => {
            se && yt(se, x, S, _), J && nn(S, _, x, "updated");
          }, I);
      },
      P = (_, S, x, I, B, L, j) => {
        for (let D = 0; D < S.length; D++) {
          const F = _[D],
            H = S[D],
            J =
              F.el && (F.type === he || !rn(F, H) || F.shapeFlag & 198)
                ? d(F.el)
                : x;
          m(F, H, J, null, I, B, L, j, !0);
        }
      },
      $ = (_, S, x, I, B) => {
        if (S !== x) {
          if (S !== we)
            for (const L in S) !Mn(L) && !(L in x) && r(_, L, S[L], null, B, I);
          for (const L in x) {
            if (Mn(L)) continue;
            const j = x[L],
              D = S[L];
            j !== D && L !== "value" && r(_, L, D, j, B, I);
          }
          "value" in x && r(_, "value", S.value, x.value, B);
        }
      },
      R = (_, S, x, I, B, L, j, D, F) => {
        const H = (S.el = _ ? _.el : l("")),
          J = (S.anchor = _ ? _.anchor : l(""));
        let { patchFlag: U, dynamicChildren: X, slotScopeIds: se } = S;
        se && (D = D ? D.concat(se) : se),
          _ == null
            ? (s(H, x, I), s(J, x, I), N(S.children || [], x, J, B, L, j, D, F))
            : U > 0 && U & 64 && X && _.dynamicChildren
            ? (P(_.dynamicChildren, X, x, B, L, j, D),
              (S.key != null || (B && S === B.subTree)) && Hi(_, S, !0))
            : M(_, S, x, J, B, L, j, D, F);
      },
      G = (_, S, x, I, B, L, j, D, F) => {
        (S.slotScopeIds = D),
          _ == null
            ? S.shapeFlag & 512
              ? B.ctx.activate(S, x, I, j, F)
              : ee(S, x, I, B, L, j, F)
            : re(_, S, F);
      },
      ee = (_, S, x, I, B, L, j) => {
        const D = (_.component = du(_, I, B));
        if ((Ls(_) && (D.ctx.renderer = Q), uu(D, !1, j), D.asyncDep)) {
          if ((B && B.registerDep(D, W, j), !_.el)) {
            const F = (D.subTree = Z(Ue));
            w(null, F, S, x), (_.placeholder = F.el);
          }
        } else W(D, _, S, x, B, L, j);
      },
      re = (_, S, x) => {
        const I = (S.component = _.component);
        if (tu(_, S, x))
          if (I.asyncDep && !I.asyncResolved) {
            A(I, S, x);
            return;
          } else (I.next = S), I.update();
        else (S.el = _.el), (I.vnode = S);
      },
      W = (_, S, x, I, B, L, j) => {
        const D = () => {
          if (_.isMounted) {
            let { next: U, bu: X, u: se, parent: fe, vnode: xe } = _;
            {
              const St = qo(_);
              if (St) {
                U && ((U.el = xe.el), A(_, U, j)),
                  St.asyncDep.then(() => {
                    _.isUnmounted || D();
                  });
                return;
              }
            }
            let ye = U,
              Xe;
            sn(_, !1),
              U ? ((U.el = xe.el), A(_, U, j)) : (U = xe),
              X && ai(X),
              (Xe = U.props && U.props.onVnodeBeforeUpdate) &&
                yt(Xe, fe, U, xe),
              sn(_, !0);
            const Je = Jo(_),
              _t = _.subTree;
            (_.subTree = Je),
              m(_t, Je, d(_t.el), k(_t), _, B, L),
              (U.el = Je.el),
              ye === null && nu(_, Je.el),
              se && Ve(se, B),
              (Xe = U.props && U.props.onVnodeUpdated) &&
                Ve(() => yt(Xe, fe, U, xe), B);
          } else {
            let U;
            const { el: X, props: se } = S,
              { bm: fe, m: xe, parent: ye, root: Xe, type: Je } = _,
              _t = Fn(S);
            sn(_, !1),
              fe && ai(fe),
              !_t && (U = se && se.onVnodeBeforeMount) && yt(U, ye, S),
              sn(_, !0);
            {
              Xe.ce &&
                Xe.ce._def.shadowRoot !== !1 &&
                Xe.ce._injectChildStyle(Je);
              const St = (_.subTree = Jo(_));
              m(null, St, x, I, _, B, L), (S.el = St.el);
            }
            if ((xe && Ve(xe, B), !_t && (U = se && se.onVnodeMounted))) {
              const St = S;
              Ve(() => yt(U, ye, St), B);
            }
            (S.shapeFlag & 256 ||
              (ye && Fn(ye.vnode) && ye.vnode.shapeFlag & 256)) &&
              _.a &&
              Ve(_.a, B),
              (_.isMounted = !0),
              (S = x = I = null);
          }
        };
        _.scope.on();
        const F = (_.effect = new Rr(D));
        _.scope.off();
        const H = (_.update = F.run.bind(F)),
          J = (_.job = F.runIfDirty.bind(F));
        (J.i = _), (J.id = _.uid), (F.scheduler = () => xi(J)), sn(_, !0), H();
      },
      A = (_, S, x) => {
        S.component = _;
        const I = _.vnode.props;
        (_.vnode = S),
          (_.next = null),
          Nd(_, S.props, I, x),
          Gd(_, S.children, x),
          ht(),
          ro(_),
          gt();
      },
      M = (_, S, x, I, B, L, j, D, F = !1) => {
        const H = _ && _.children,
          J = _ ? _.shapeFlag : 0,
          U = S.children,
          { patchFlag: X, shapeFlag: se } = S;
        if (X > 0) {
          if (X & 128) {
            le(H, U, x, I, B, L, j, D, F);
            return;
          } else if (X & 256) {
            Y(H, U, x, I, B, L, j, D, F);
            return;
          }
        }
        se & 8
          ? (J & 16 && Qe(H, B, L), U !== H && c(x, U))
          : J & 16
          ? se & 16
            ? le(H, U, x, I, B, L, j, D, F)
            : Qe(H, B, L, !0)
          : (J & 8 && c(x, ""), se & 16 && N(U, x, I, B, L, j, D, F));
      },
      Y = (_, S, x, I, B, L, j, D, F) => {
        (_ = _ || un), (S = S || un);
        const H = _.length,
          J = S.length,
          U = Math.min(H, J);
        let X;
        for (X = 0; X < U; X++) {
          const se = (S[X] = F ? Wt(S[X]) : vt(S[X]));
          m(_[X], se, x, null, B, L, j, D, F);
        }
        H > J ? Qe(_, B, L, !0, !1, U) : N(S, x, I, B, L, j, D, F, U);
      },
      le = (_, S, x, I, B, L, j, D, F) => {
        let H = 0;
        const J = S.length;
        let U = _.length - 1,
          X = J - 1;
        for (; H <= U && H <= X; ) {
          const se = _[H],
            fe = (S[H] = F ? Wt(S[H]) : vt(S[H]));
          if (rn(se, fe)) m(se, fe, x, null, B, L, j, D, F);
          else break;
          H++;
        }
        for (; H <= U && H <= X; ) {
          const se = _[U],
            fe = (S[X] = F ? Wt(S[X]) : vt(S[X]));
          if (rn(se, fe)) m(se, fe, x, null, B, L, j, D, F);
          else break;
          U--, X--;
        }
        if (H > U) {
          if (H <= X) {
            const se = X + 1,
              fe = se < J ? S[se].el : I;
            for (; H <= X; )
              m(null, (S[H] = F ? Wt(S[H]) : vt(S[H])), x, fe, B, L, j, D, F),
                H++;
          }
        } else if (H > X) for (; H <= U; ) Ee(_[H], B, L, !0), H++;
        else {
          const se = H,
            fe = H,
            xe = new Map();
          for (H = fe; H <= X; H++) {
            const nt = (S[H] = F ? Wt(S[H]) : vt(S[H]));
            nt.key != null && xe.set(nt.key, H);
          }
          let ye,
            Xe = 0;
          const Je = X - fe + 1;
          let _t = !1,
            St = 0;
          const as = new Array(Je);
          for (H = 0; H < Je; H++) as[H] = 0;
          for (H = se; H <= U; H++) {
            const nt = _[H];
            if (Xe >= Je) {
              Ee(nt, B, L, !0);
              continue;
            }
            let Et;
            if (nt.key != null) Et = xe.get(nt.key);
            else
              for (ye = fe; ye <= X; ye++)
                if (as[ye - fe] === 0 && rn(nt, S[ye])) {
                  Et = ye;
                  break;
                }
            Et === void 0
              ? Ee(nt, B, L, !0)
              : ((as[Et - fe] = H + 1),
                Et >= St ? (St = Et) : (_t = !0),
                m(nt, S[Et], x, null, B, L, j, D, F),
                Xe++);
          }
          const ec = _t ? Wd(as) : un;
          for (ye = ec.length - 1, H = Je - 1; H >= 0; H--) {
            const nt = fe + H,
              Et = S[nt],
              tc = S[nt + 1],
              nc = nt + 1 < J ? tc.el || tc.placeholder : I;
            as[H] === 0
              ? m(null, Et, x, nc, B, L, j, D, F)
              : _t && (ye < 0 || H !== ec[ye] ? Ce(Et, x, nc, 2) : ye--);
          }
        }
      },
      Ce = (_, S, x, I, B = null) => {
        const { el: L, type: j, transition: D, children: F, shapeFlag: H } = _;
        if (H & 6) {
          Ce(_.component.subTree, S, x, I);
          return;
        }
        if (H & 128) {
          _.suspense.move(S, x, I);
          return;
        }
        if (H & 64) {
          j.move(_, S, x, Q);
          return;
        }
        if (j === he) {
          s(L, S, x);
          for (let U = 0; U < F.length; U++) Ce(F[U], S, x, I);
          s(_.anchor, S, x);
          return;
        }
        if (j === Bs) {
          y(_, S, x);
          return;
        }
        if (I !== 2 && H & 1 && D)
          if (I === 0) D.beforeEnter(L), s(L, S, x), Ve(() => D.enter(L), B);
          else {
            const { leave: U, delayLeave: X, afterLeave: se } = D,
              fe = () => {
                _.ctx.isUnmounted ? i(L) : s(L, S, x);
              },
              xe = () => {
                L._isLeaving && L[Pt](!0),
                  U(L, () => {
                    fe(), se && se();
                  });
              };
            X ? X(L, fe, xe) : xe();
          }
        else s(L, S, x);
      },
      Ee = (_, S, x, I = !1, B = !1) => {
        const {
          type: L,
          props: j,
          ref: D,
          children: F,
          dynamicChildren: H,
          shapeFlag: J,
          patchFlag: U,
          dirs: X,
          cacheIndex: se,
        } = _;
        if (
          (U === -2 && (B = !1),
          D != null && (ht(), Hn(D, null, x, _, !0), gt()),
          se != null && (S.renderCache[se] = void 0),
          J & 256)
        ) {
          S.ctx.deactivate(_);
          return;
        }
        const fe = J & 1 && X,
          xe = !Fn(_);
        let ye;
        if ((xe && (ye = j && j.onVnodeBeforeUnmount) && yt(ye, S, _), J & 6))
          Bt(_.component, x, I);
        else {
          if (J & 128) {
            _.suspense.unmount(x, I);
            return;
          }
          fe && nn(_, null, S, "beforeUnmount"),
            J & 64
              ? _.type.remove(_, S, x, Q, I)
              : H && !H.hasOnce && (L !== he || (U > 0 && U & 64))
              ? Qe(H, S, x, !1, !0)
              : ((L === he && U & 384) || (!B && J & 16)) && Qe(F, S, x),
            I && ft(_);
        }
        ((xe && (ye = j && j.onVnodeUnmounted)) || fe) &&
          Ve(() => {
            ye && yt(ye, S, _), fe && nn(_, null, S, "unmounted");
          }, x);
      },
      ft = (_) => {
        const { type: S, el: x, anchor: I, transition: B } = _;
        if (S === he) {
          cn(x, I);
          return;
        }
        if (S === Bs) {
          E(_);
          return;
        }
        const L = () => {
          i(x), B && !B.persisted && B.afterLeave && B.afterLeave();
        };
        if (_.shapeFlag & 1 && B && !B.persisted) {
          const { leave: j, delayLeave: D } = B,
            F = () => j(x, L);
          D ? D(_.el, L, F) : F();
        } else L();
      },
      cn = (_, S) => {
        let x;
        for (; _ !== S; ) (x = f(_)), i(_), (_ = x);
        i(S);
      },
      Bt = (_, S, x) => {
        const { bum: I, scope: B, job: L, subTree: j, um: D, m: F, a: H } = _;
        Ko(F),
          Ko(H),
          I && ai(I),
          B.stop(),
          L && ((L.flags |= 8), Ee(j, _, S, x)),
          D && Ve(D, S),
          Ve(() => {
            _.isUnmounted = !0;
          }, S);
      },
      Qe = (_, S, x, I = !1, B = !1, L = 0) => {
        for (let j = L; j < _.length; j++) Ee(_[j], S, x, I, B);
      },
      k = (_) => {
        if (_.shapeFlag & 6) return k(_.component.subTree);
        if (_.shapeFlag & 128) return _.suspense.next();
        const S = f(_.anchor || _.el),
          x = S && S[co];
        return x ? f(x) : S;
      };
    let q = !1;
    const V = (_, S, x) => {
        _ == null
          ? S._vnode && Ee(S._vnode, null, null, !0)
          : m(S._vnode || null, _, S, null, null, null, x),
          (S._vnode = _),
          q || ((q = !0), ro(), oo(), (q = !1));
      },
      Q = {
        p: m,
        um: Ee,
        m: Ce,
        r: ft,
        mt: ee,
        mc: N,
        pc: M,
        pbc: P,
        n: k,
        o: t,
      };
    return { render: V, hydrate: void 0, createApp: $d(V) };
  }
  function Ni({ type: t, props: e }, n) {
    return (n === "svg" && t === "foreignObject") ||
      (n === "mathml" &&
        t === "annotation-xml" &&
        e &&
        e.encoding &&
        e.encoding.includes("html"))
      ? void 0
      : n;
  }
  function sn({ effect: t, job: e }, n) {
    n ? ((t.flags |= 32), (e.flags |= 4)) : ((t.flags &= -33), (e.flags &= -5));
  }
  function Ud(t, e) {
    return (!t || (t && !t.pendingBranch)) && e && !e.persisted;
  }
  function Hi(t, e, n = !1) {
    const s = t.children,
      i = e.children;
    if (ne(s) && ne(i))
      for (let r = 0; r < s.length; r++) {
        const o = s[r];
        let l = i[r];
        l.shapeFlag & 1 &&
          !l.dynamicChildren &&
          ((l.patchFlag <= 0 || l.patchFlag === 32) &&
            ((l = i[r] = Wt(i[r])), (l.el = o.el)),
          !n && l.patchFlag !== -2 && Hi(o, l)),
          l.type === Rs && l.patchFlag !== -1 && (l.el = o.el),
          l.type === Ue && !l.el && (l.el = o.el);
      }
  }
  function Wd(t) {
    const e = t.slice(),
      n = [0];
    let s, i, r, o, l;
    const a = t.length;
    for (s = 0; s < a; s++) {
      const u = t[s];
      if (u !== 0) {
        if (((i = n[n.length - 1]), t[i] < u)) {
          (e[s] = i), n.push(s);
          continue;
        }
        for (r = 0, o = n.length - 1; r < o; )
          (l = (r + o) >> 1), t[n[l]] < u ? (r = l + 1) : (o = l);
        u < t[n[r]] && (r > 0 && (e[s] = n[r - 1]), (n[r] = s));
      }
    }
    for (r = n.length, o = n[r - 1]; r-- > 0; ) (n[r] = o), (o = e[o]);
    return n;
  }
  function qo(t) {
    const e = t.subTree.component;
    if (e) return e.asyncDep && !e.asyncResolved ? e : qo(e);
  }
  function Ko(t) {
    if (t) for (let e = 0; e < t.length; e++) t[e].flags |= 8;
  }
  const qd = Symbol.for("v-scx"),
    Kd = () => dt(qd);
  function jt(t, e, n) {
    return Yo(t, e, n);
  }
  function Yo(t, e, n = we) {
    const { immediate: s, deep: i, flush: r, once: o } = n,
      l = ke({}, n),
      a = (e && s) || (!e && r !== "post");
    let u;
    if (qn) {
      if (r === "sync") {
        const p = Kd();
        u = p.__watcherHandles || (p.__watcherHandles = []);
      } else if (!a) {
        const p = () => {};
        return (p.stop = pt), (p.resume = pt), (p.pause = pt), p;
      }
    }
    const c = He;
    l.call = (p, h, m) => at(p, c, h, m);
    let d = !1;
    r === "post"
      ? (l.scheduler = (p) => {
          Ve(p, c && c.suspense);
        })
      : r !== "sync" &&
        ((d = !0),
        (l.scheduler = (p, h) => {
          h ? p() : xi(p);
        })),
      (l.augmentJob = (p) => {
        e && (p.flags |= 4),
          d && ((p.flags |= 2), c && ((p.id = c.uid), (p.i = c)));
      });
    const f = ld(t, e, l);
    return qn && (u ? u.push(f) : a && f()), f;
  }
  function Yd(t, e, n) {
    const s = this.proxy,
      i = Ae(t) ? (t.includes(".") ? Qo(s, t) : () => s[t]) : t.bind(s, s);
    let r;
    ie(e) ? (r = e) : ((r = e.handler), (n = e));
    const o = Wn(this),
      l = Yo(i, r.bind(s), n);
    return o(), l;
  }
  function Qo(t, e) {
    const n = e.split(".");
    return () => {
      let s = t;
      for (let i = 0; i < n.length && s; i++) s = s[n[i]];
      return s;
    };
  }
  const Qd = (t, e) =>
    e === "modelValue" || e === "model-value"
      ? t.modelModifiers
      : t[`${e}Modifiers`] || t[`${st(e)}Modifiers`] || t[`${Zt(e)}Modifiers`];
  function Xd(t, e, ...n) {
    if (t.isUnmounted) return;
    const s = t.vnode.props || we;
    let i = n;
    const r = e.startsWith("update:"),
      o = r && Qd(s, e.slice(7));
    o &&
      (o.trim && (i = n.map((c) => (Ae(c) ? c.trim() : c))),
      o.number && (i = n.map(Ac)));
    let l,
      a = s[(l = li(e))] || s[(l = li(st(e)))];
    !a && r && (a = s[(l = li(Zt(e)))]), a && at(a, t, 6, i);
    const u = s[l + "Once"];
    if (u) {
      if (!t.emitted) t.emitted = {};
      else if (t.emitted[l]) return;
      (t.emitted[l] = !0), at(u, t, 6, i);
    }
  }
  const Jd = new WeakMap();
  function Xo(t, e, n = !1) {
    const s = n ? Jd : e.emitsCache,
      i = s.get(t);
    if (i !== void 0) return i;
    const r = t.emits;
    let o = {},
      l = !1;
    if (!ie(t)) {
      const a = (u) => {
        const c = Xo(u, e, !0);
        c && ((l = !0), ke(o, c));
      };
      !n && e.mixins.length && e.mixins.forEach(a),
        t.extends && a(t.extends),
        t.mixins && t.mixins.forEach(a);
    }
    return !r && !l
      ? (Te(t) && s.set(t, null), null)
      : (ne(r) ? r.forEach((a) => (o[a] = null)) : ke(o, r),
        Te(t) && s.set(t, o),
        o);
  }
  function ks(t, e) {
    return !t || !cs(e)
      ? !1
      : ((e = e.slice(2).replace(/Once$/, "")),
        me(t, e[0].toLowerCase() + e.slice(1)) || me(t, Zt(e)) || me(t, e));
  }
  function Uv() {}
  function Jo(t) {
    const {
        type: e,
        vnode: n,
        proxy: s,
        withProxy: i,
        propsOptions: [r],
        slots: o,
        attrs: l,
        emit: a,
        render: u,
        renderCache: c,
        props: d,
        data: f,
        setupState: p,
        ctx: h,
        inheritAttrs: m,
      } = t,
      b = Ts(t);
    let w, g;
    try {
      if (n.shapeFlag & 4) {
        const E = i || s,
          C = E;
        (w = vt(u.call(C, E, c, d, p, f, h))), (g = l);
      } else {
        const E = e;
        (w = vt(
          E.length > 1 ? E(d, { attrs: l, slots: o, emit: a }) : E(d, null)
        )),
          (g = e.props ? l : Zd(l));
      }
    } catch (E) {
      (jn.length = 0), Es(E, t, 1), (w = Z(Ue));
    }
    let y = w;
    if (g && m !== !1) {
      const E = Object.keys(g),
        { shapeFlag: C } = y;
      E.length &&
        C & 7 &&
        (r && E.some(ii) && (g = eu(g, r)), (y = Vt(y, g, !1, !0)));
    }
    return (
      n.dirs &&
        ((y = Vt(y, null, !1, !0)),
        (y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs)),
      n.transition && Nn(y, n.transition),
      (w = y),
      Ts(b),
      w
    );
  }
  const Zd = (t) => {
      let e;
      for (const n in t)
        (n === "class" || n === "style" || cs(n)) &&
          ((e || (e = {}))[n] = t[n]);
      return e;
    },
    eu = (t, e) => {
      const n = {};
      for (const s in t) (!ii(s) || !(s.slice(9) in e)) && (n[s] = t[s]);
      return n;
    };
  function tu(t, e, n) {
    const { props: s, children: i, component: r } = t,
      { props: o, children: l, patchFlag: a } = e,
      u = r.emitsOptions;
    if (e.dirs || e.transition) return !0;
    if (n && a >= 0) {
      if (a & 1024) return !0;
      if (a & 16) return s ? Zo(s, o, u) : !!o;
      if (a & 8) {
        const c = e.dynamicProps;
        for (let d = 0; d < c.length; d++) {
          const f = c[d];
          if (o[f] !== s[f] && !ks(u, f)) return !0;
        }
      }
    } else
      return (i || l) && (!l || !l.$stable)
        ? !0
        : s === o
        ? !1
        : s
        ? o
          ? Zo(s, o, u)
          : !0
        : !!o;
    return !1;
  }
  function Zo(t, e, n) {
    const s = Object.keys(e);
    if (s.length !== Object.keys(t).length) return !0;
    for (let i = 0; i < s.length; i++) {
      const r = s[i];
      if (e[r] !== t[r] && !ks(n, r)) return !0;
    }
    return !1;
  }
  function nu({ vnode: t, parent: e }, n) {
    for (; e; ) {
      const s = e.subTree;
      if (
        (s.suspense && s.suspense.activeBranch === t && (s.el = t.el), s === t)
      )
        ((t = e.vnode).el = n), (e = e.parent);
      else break;
    }
  }
  const el = (t) => t.__isSuspense;
  function su(t, e) {
    e && e.pendingBranch
      ? ne(t)
        ? e.effects.push(...t)
        : e.effects.push(t)
      : hd(t);
  }
  const he = Symbol.for("v-fgt"),
    Rs = Symbol.for("v-txt"),
    Ue = Symbol.for("v-cmt"),
    Bs = Symbol.for("v-stc"),
    jn = [];
  let Ze = null;
  function K(t = !1) {
    jn.push((Ze = t ? null : []));
  }
  function iu() {
    jn.pop(), (Ze = jn[jn.length - 1] || null);
  }
  let Vn = 1;
  function $s(t, e = !1) {
    (Vn += t), t < 0 && Ze && e && (Ze.hasOnce = !0);
  }
  function tl(t) {
    return (
      (t.dynamicChildren = Vn > 0 ? Ze || un : null),
      iu(),
      Vn > 0 && Ze && Ze.push(t),
      t
    );
  }
  function oe(t, e, n, s, i, r) {
    return tl(v(t, e, n, s, i, r, !0));
  }
  function Me(t, e, n, s, i) {
    return tl(Z(t, e, n, s, i, !0));
  }
  function zs(t) {
    return t ? t.__v_isVNode === !0 : !1;
  }
  function rn(t, e) {
    return t.type === e.type && t.key === e.key;
  }
  const nl = ({ key: t }) => (t != null ? t : null),
    Ns = ({ ref: t, ref_key: e, ref_for: n }) => (
      typeof t == "number" && (t = "" + t),
      t != null
        ? Ae(t) || $e(t) || ie(t)
          ? { i: ct, r: t, k: e, f: !!n }
          : t
        : null
    );
  function v(
    t,
    e = null,
    n = null,
    s = 0,
    i = null,
    r = t === he ? 0 : 1,
    o = !1,
    l = !1
  ) {
    const a = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: t,
      props: e,
      key: e && nl(e),
      ref: e && Ns(e),
      scopeId: ao,
      slotScopeIds: null,
      children: n,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag: r,
      patchFlag: s,
      dynamicProps: i,
      dynamicChildren: null,
      appContext: null,
      ctx: ct,
    };
    return (
      l
        ? (Fi(a, n), r & 128 && t.normalize(a))
        : n && (a.shapeFlag |= Ae(n) ? 8 : 16),
      Vn > 0 &&
        !o &&
        Ze &&
        (a.patchFlag > 0 || r & 6) &&
        a.patchFlag !== 32 &&
        Ze.push(a),
      a
    );
  }
  const Z = ru;
  function ru(t, e = null, n = null, s = 0, i = null, r = !1) {
    if (((!t || t === Mo) && (t = Ue), zs(t))) {
      const l = Vt(t, e, !0);
      return (
        n && Fi(l, n),
        Vn > 0 &&
          !r &&
          Ze &&
          (l.shapeFlag & 6 ? (Ze[Ze.indexOf(t)] = l) : Ze.push(l)),
        (l.patchFlag = -2),
        l
      );
    }
    if ((vu(t) && (t = t.__vccOpts), e)) {
      e = ou(e);
      let { class: l, style: a } = e;
      l && !Ae(l) && (e.class = De(l)),
        Te(a) && (Si(a) && !ne(a) && (a = ke({}, a)), (e.style = ci(a)));
    }
    const o = Ae(t) ? 1 : el(t) ? 128 : uo(t) ? 64 : Te(t) ? 4 : ie(t) ? 2 : 0;
    return v(t, e, n, s, i, o, r, !0);
  }
  function ou(t) {
    return t ? (Si(t) || Fo(t) ? ke({}, t) : t) : null;
  }
  function Vt(t, e, n = !1, s = !1) {
    const { props: i, ref: r, patchFlag: o, children: l, transition: a } = t,
      u = e ? lu(i || {}, e) : i,
      c = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: t.type,
        props: u,
        key: u && nl(u),
        ref:
          e && e.ref
            ? n && r
              ? ne(r)
                ? r.concat(Ns(e))
                : [r, Ns(e)]
              : Ns(e)
            : r,
        scopeId: t.scopeId,
        slotScopeIds: t.slotScopeIds,
        children: l,
        target: t.target,
        targetStart: t.targetStart,
        targetAnchor: t.targetAnchor,
        staticCount: t.staticCount,
        shapeFlag: t.shapeFlag,
        patchFlag: e && t.type !== he ? (o === -1 ? 16 : o | 16) : o,
        dynamicProps: t.dynamicProps,
        dynamicChildren: t.dynamicChildren,
        appContext: t.appContext,
        dirs: t.dirs,
        transition: a,
        component: t.component,
        suspense: t.suspense,
        ssContent: t.ssContent && Vt(t.ssContent),
        ssFallback: t.ssFallback && Vt(t.ssFallback),
        placeholder: t.placeholder,
        el: t.el,
        anchor: t.anchor,
        ctx: t.ctx,
        ce: t.ce,
      };
    return a && s && Nn(c, a.clone(c)), c;
  }
  function Pe(t = " ", e = 0) {
    return Z(Rs, null, t, e);
  }
  function Ut(t, e) {
    const n = Z(Bs, null, t);
    return (n.staticCount = e), n;
  }
  function Un(t = "", e = !1) {
    return e ? (K(), Me(Ue, null, t)) : Z(Ue, null, t);
  }
  function vt(t) {
    return t == null || typeof t == "boolean"
      ? Z(Ue)
      : ne(t)
      ? Z(he, null, t.slice())
      : zs(t)
      ? Wt(t)
      : Z(Rs, null, String(t));
  }
  function Wt(t) {
    return (t.el === null && t.patchFlag !== -1) || t.memo ? t : Vt(t);
  }
  function Fi(t, e) {
    let n = 0;
    const { shapeFlag: s } = t;
    if (e == null) e = null;
    else if (ne(e)) n = 16;
    else if (typeof e == "object")
      if (s & 65) {
        const i = e.default;
        i && (i._c && (i._d = !1), Fi(t, i()), i._c && (i._d = !0));
        return;
      } else {
        n = 32;
        const i = e._;
        !i && !Fo(e)
          ? (e._ctx = ct)
          : i === 3 &&
            ct &&
            (ct.slots._ === 1 ? (e._ = 1) : ((e._ = 2), (t.patchFlag |= 1024)));
      }
    else
      ie(e)
        ? ((e = { default: e, _ctx: ct }), (n = 32))
        : ((e = String(e)), s & 64 ? ((n = 16), (e = [Pe(e)])) : (n = 8));
    (t.children = e), (t.shapeFlag |= n);
  }
  function lu(...t) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const s = t[n];
      for (const i in s)
        if (i === "class")
          e.class !== s.class && (e.class = De([e.class, s.class]));
        else if (i === "style") e.style = ci([e.style, s.style]);
        else if (cs(i)) {
          const r = e[i],
            o = s[i];
          o &&
            r !== o &&
            !(ne(r) && r.includes(o)) &&
            (e[i] = r ? [].concat(r, o) : o);
        } else i !== "" && (e[i] = s[i]);
    }
    return e;
  }
  function yt(t, e, n, s = null) {
    at(t, e, 7, [n, s]);
  }
  const au = zo();
  let cu = 0;
  function du(t, e, n) {
    const s = t.type,
      i = (e ? e.appContext : t.appContext) || au,
      r = {
        uid: cu++,
        vnode: t,
        type: s,
        parent: e,
        appContext: i,
        root: null,
        next: null,
        subTree: null,
        effect: null,
        update: null,
        job: null,
        scope: new Rc(!0),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: e ? e.provides : Object.create(i.provides),
        ids: e ? e.ids : ["", 0, 0],
        accessCache: null,
        renderCache: [],
        components: null,
        directives: null,
        propsOptions: Go(s, i),
        emitsOptions: Xo(s, i),
        emit: null,
        emitted: null,
        propsDefaults: we,
        inheritAttrs: s.inheritAttrs,
        ctx: we,
        data: we,
        props: we,
        attrs: we,
        slots: we,
        refs: we,
        setupState: we,
        setupContext: null,
        suspense: n,
        suspenseId: n ? n.pendingId : 0,
        asyncDep: null,
        asyncResolved: !1,
        isMounted: !1,
        isUnmounted: !1,
        isDeactivated: !1,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null,
      };
    return (
      (r.ctx = { _: r }),
      (r.root = e ? e.root : r),
      (r.emit = Xd.bind(null, r)),
      t.ce && t.ce(r),
      r
    );
  }
  let He = null;
  const sl = () => He || ct;
  let Hs, Di;
  {
    const t = ps(),
      e = (n, s) => {
        let i;
        return (
          (i = t[n]) || (i = t[n] = []),
          i.push(s),
          (r) => {
            i.length > 1 ? i.forEach((o) => o(r)) : i[0](r);
          }
        );
      };
    (Hs = e("__VUE_INSTANCE_SETTERS__", (n) => (He = n))),
      (Di = e("__VUE_SSR_SETTERS__", (n) => (qn = n)));
  }
  const Wn = (t) => {
      const e = He;
      return (
        Hs(t),
        t.scope.on(),
        () => {
          t.scope.off(), Hs(e);
        }
      );
    },
    il = () => {
      He && He.scope.off(), Hs(null);
    };
  function rl(t) {
    return t.vnode.shapeFlag & 4;
  }
  let qn = !1;
  function uu(t, e = !1, n = !1) {
    e && Di(e);
    const { props: s, children: i } = t.vnode,
      r = rl(t);
    zd(t, s, r, e), Dd(t, i, n || e);
    const o = r ? fu(t, e) : void 0;
    return e && Di(!1), o;
  }
  function fu(t, e) {
    const n = t.type;
    (t.accessCache = Object.create(null)), (t.proxy = new Proxy(t.ctx, Pd));
    const { setup: s } = n;
    if (s) {
      ht();
      const i = (t.setupContext = s.length > 1 ? hu(t) : null),
        r = Wn(t),
        o = gn(s, t, 0, [t.props, i]),
        l = Cr(o);
      if ((gt(), r(), (l || t.sp) && !Fn(t) && Eo(t), l)) {
        if ((o.then(il, il), e))
          return o
            .then((a) => {
              ol(t, a);
            })
            .catch((a) => {
              Es(a, t, 0);
            });
        t.asyncDep = o;
      } else ol(t, o);
    } else ll(t);
  }
  function ol(t, e, n) {
    ie(e)
      ? t.type.__ssrInlineRender
        ? (t.ssrRender = e)
        : (t.render = e)
      : Te(e) && (t.setupState = to(e)),
      ll(t);
  }
  function ll(t, e, n) {
    const s = t.type;
    t.render || (t.render = s.render || pt);
    {
      const i = Wn(t);
      ht();
      try {
        Ld(t);
      } finally {
        gt(), i();
      }
    }
  }
  const pu = {
    get(t, e) {
      return Ne(t, "get", ""), t[e];
    },
  };
  function hu(t) {
    const e = (n) => {
      t.exposed = n || {};
    };
    return {
      attrs: new Proxy(t.attrs, pu),
      slots: t.slots,
      emit: t.emit,
      expose: e,
    };
  }
  function Gi(t) {
    return t.exposed
      ? t.exposeProxy ||
          (t.exposeProxy = new Proxy(to(ed(t.exposed)), {
            get(e, n) {
              if (n in e) return e[n];
              if (n in Dn) return Dn[n](t);
            },
            has(e, n) {
              return n in e || n in Dn;
            },
          }))
      : t.proxy;
  }
  const gu = /(?:^|[-_])\w/g,
    mu = (t) => t.replace(gu, (e) => e.toUpperCase()).replace(/[-_]/g, "");
  function al(t, e = !0) {
    return ie(t) ? t.displayName || t.name : t.name || (e && t.__name);
  }
  function cl(t, e, n = !1) {
    let s = al(e);
    if (!s && e.__file) {
      const i = e.__file.match(/([^/\\]+)\.\w+$/);
      i && (s = i[1]);
    }
    if (!s && t && t.parent) {
      const i = (r) => {
        for (const o in r) if (r[o] === e) return o;
      };
      s =
        i(t.components || t.parent.type.components) ||
        i(t.appContext.components);
    }
    return s ? mu(s) : n ? "App" : "Anonymous";
  }
  function vu(t) {
    return ie(t) && "__vccOpts" in t;
  }
  const ze = (t, e) => rd(t, e, qn);
  function We(t, e, n) {
    const s = (r, o, l) => {
        $s(-1);
        try {
          return Z(r, o, l);
        } finally {
          $s(1);
        }
      },
      i = arguments.length;
    return i === 2
      ? Te(e) && !ne(e)
        ? zs(e)
          ? s(t, null, [e])
          : s(t, e)
        : s(t, null, e)
      : (i > 3
          ? (n = Array.prototype.slice.call(arguments, 2))
          : i === 3 && zs(n) && (n = [n]),
        s(t, e, n));
  }
  const yu = "3.5.21";
  /**
   * @vue/runtime-dom v3.5.21
   * (c) 2018-present Yuxi (Evan) You and Vue contributors
   * @license MIT
   **/ let ji;
  const dl = typeof window != "undefined" && window.trustedTypes;
  if (dl)
    try {
      ji = dl.createPolicy("vue", { createHTML: (t) => t });
    } catch (t) {}
  const ul = ji ? (t) => ji.createHTML(t) : (t) => t,
    bu = "http://www.w3.org/2000/svg",
    wu = "http://www.w3.org/1998/Math/MathML",
    Ot = typeof document != "undefined" ? document : null,
    fl = Ot && Ot.createElement("template"),
    _u = {
      insert: (t, e, n) => {
        e.insertBefore(t, n || null);
      },
      remove: (t) => {
        const e = t.parentNode;
        e && e.removeChild(t);
      },
      createElement: (t, e, n, s) => {
        const i =
          e === "svg"
            ? Ot.createElementNS(bu, t)
            : e === "mathml"
            ? Ot.createElementNS(wu, t)
            : n
            ? Ot.createElement(t, { is: n })
            : Ot.createElement(t);
        return (
          t === "select" &&
            s &&
            s.multiple != null &&
            i.setAttribute("multiple", s.multiple),
          i
        );
      },
      createText: (t) => Ot.createTextNode(t),
      createComment: (t) => Ot.createComment(t),
      setText: (t, e) => {
        t.nodeValue = e;
      },
      setElementText: (t, e) => {
        t.textContent = e;
      },
      parentNode: (t) => t.parentNode,
      nextSibling: (t) => t.nextSibling,
      querySelector: (t) => Ot.querySelector(t),
      setScopeId(t, e) {
        t.setAttribute(e, "");
      },
      insertStaticContent(t, e, n, s, i, r) {
        const o = n ? n.previousSibling : e.lastChild;
        if (i && (i === r || i.nextSibling))
          for (
            ;
            e.insertBefore(i.cloneNode(!0), n),
              !(i === r || !(i = i.nextSibling));

          );
        else {
          fl.innerHTML = ul(
            s === "svg"
              ? `<svg>${t}</svg>`
              : s === "mathml"
              ? `<math>${t}</math>`
              : t
          );
          const l = fl.content;
          if (s === "svg" || s === "mathml") {
            const a = l.firstChild;
            for (; a.firstChild; ) l.appendChild(a.firstChild);
            l.removeChild(a);
          }
          e.insertBefore(l, n);
        }
        return [
          o ? o.nextSibling : e.firstChild,
          n ? n.previousSibling : e.lastChild,
        ];
      },
    },
    qt = "transition",
    Kn = "animation",
    Yn = Symbol("_vtc"),
    pl = {
      name: String,
      type: String,
      css: { type: Boolean, default: !0 },
      duration: [String, Number, Object],
      enterFromClass: String,
      enterActiveClass: String,
      enterToClass: String,
      appearFromClass: String,
      appearActiveClass: String,
      appearToClass: String,
      leaveFromClass: String,
      leaveActiveClass: String,
      leaveToClass: String,
    },
    Su = ke({}, vo, pl),
    hl = ((t) => ((t.displayName = "Transition"), (t.props = Su), t))(
      (t, { slots: e }) => We(bd, Eu(t), e)
    ),
    on = (t, e = []) => {
      ne(t) ? t.forEach((n) => n(...e)) : t && t(...e);
    },
    gl = (t) => (t ? (ne(t) ? t.some((e) => e.length > 1) : t.length > 1) : !1);
  function Eu(t) {
    const e = {};
    for (const R in t) R in pl || (e[R] = t[R]);
    if (t.css === !1) return e;
    const {
        name: n = "v",
        type: s,
        duration: i,
        enterFromClass: r = `${n}-enter-from`,
        enterActiveClass: o = `${n}-enter-active`,
        enterToClass: l = `${n}-enter-to`,
        appearFromClass: a = r,
        appearActiveClass: u = o,
        appearToClass: c = l,
        leaveFromClass: d = `${n}-leave-from`,
        leaveActiveClass: f = `${n}-leave-active`,
        leaveToClass: p = `${n}-leave-to`,
      } = t,
      h = xu(i),
      m = h && h[0],
      b = h && h[1],
      {
        onBeforeEnter: w,
        onEnter: g,
        onEnterCancelled: y,
        onLeave: E,
        onLeaveCancelled: C,
        onBeforeAppear: O = w,
        onAppear: z = g,
        onAppearCancelled: N = y,
      } = e,
      T = (R, G, ee, re) => {
        (R._enterCancelled = re),
          ln(R, G ? c : l),
          ln(R, G ? u : o),
          ee && ee();
      },
      P = (R, G) => {
        (R._isLeaving = !1), ln(R, d), ln(R, p), ln(R, f), G && G();
      },
      $ = (R) => (G, ee) => {
        const re = R ? z : g,
          W = () => T(G, R, ee);
        on(re, [G, W]),
          ml(() => {
            ln(G, R ? a : r), kt(G, R ? c : l), gl(re) || vl(G, s, m, W);
          });
      };
    return ke(e, {
      onBeforeEnter(R) {
        on(w, [R]), kt(R, r), kt(R, o);
      },
      onBeforeAppear(R) {
        on(O, [R]), kt(R, a), kt(R, u);
      },
      onEnter: $(!1),
      onAppear: $(!0),
      onLeave(R, G) {
        R._isLeaving = !0;
        const ee = () => P(R, G);
        kt(R, d),
          R._enterCancelled ? (kt(R, f), wl()) : (wl(), kt(R, f)),
          ml(() => {
            R._isLeaving && (ln(R, d), kt(R, p), gl(E) || vl(R, s, b, ee));
          }),
          on(E, [R, ee]);
      },
      onEnterCancelled(R) {
        T(R, !1, void 0, !0), on(y, [R]);
      },
      onAppearCancelled(R) {
        T(R, !0, void 0, !0), on(N, [R]);
      },
      onLeaveCancelled(R) {
        P(R), on(C, [R]);
      },
    });
  }
  function xu(t) {
    if (t == null) return null;
    if (Te(t)) return [Vi(t.enter), Vi(t.leave)];
    {
      const e = Vi(t);
      return [e, e];
    }
  }
  function Vi(t) {
    return Mc(t);
  }
  function kt(t, e) {
    e.split(/\s+/).forEach((n) => n && t.classList.add(n)),
      (t[Yn] || (t[Yn] = new Set())).add(e);
  }
  function ln(t, e) {
    e.split(/\s+/).forEach((s) => s && t.classList.remove(s));
    const n = t[Yn];
    n && (n.delete(e), n.size || (t[Yn] = void 0));
  }
  function ml(t) {
    requestAnimationFrame(() => {
      requestAnimationFrame(t);
    });
  }
  let Tu = 0;
  function vl(t, e, n, s) {
    const i = (t._endId = ++Tu),
      r = () => {
        i === t._endId && s();
      };
    if (n != null) return setTimeout(r, n);
    const { type: o, timeout: l, propCount: a } = Cu(t, e);
    if (!o) return s();
    const u = o + "end";
    let c = 0;
    const d = () => {
        t.removeEventListener(u, f), r();
      },
      f = (p) => {
        p.target === t && ++c >= a && d();
      };
    setTimeout(() => {
      c < a && d();
    }, l + 1),
      t.addEventListener(u, f);
  }
  function Cu(t, e) {
    const n = window.getComputedStyle(t),
      s = (h) => (n[h] || "").split(", "),
      i = s(`${qt}Delay`),
      r = s(`${qt}Duration`),
      o = yl(i, r),
      l = s(`${Kn}Delay`),
      a = s(`${Kn}Duration`),
      u = yl(l, a);
    let c = null,
      d = 0,
      f = 0;
    e === qt
      ? o > 0 && ((c = qt), (d = o), (f = r.length))
      : e === Kn
      ? u > 0 && ((c = Kn), (d = u), (f = a.length))
      : ((d = Math.max(o, u)),
        (c = d > 0 ? (o > u ? qt : Kn) : null),
        (f = c ? (c === qt ? r.length : a.length) : 0));
    const p =
      c === qt &&
      /\b(?:transform|all)(?:,|$)/.test(s(`${qt}Property`).toString());
    return { type: c, timeout: d, propCount: f, hasTransform: p };
  }
  function yl(t, e) {
    for (; t.length < e.length; ) t = t.concat(t);
    return Math.max(...e.map((n, s) => bl(n) + bl(t[s])));
  }
  function bl(t) {
    return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function wl() {
    return document.body.offsetHeight;
  }
  function Au(t, e, n) {
    const s = t[Yn];
    s && (e = (e ? [e, ...s] : [...s]).join(" ")),
      e == null
        ? t.removeAttribute("class")
        : n
        ? t.setAttribute("class", e)
        : (t.className = e);
  }
  const _l = Symbol("_vod"),
    Mu = Symbol("_vsh"),
    Pu = Symbol(""),
    Lu = /(?:^|;)\s*display\s*:/;
  function Iu(t, e, n) {
    const s = t.style,
      i = Ae(n);
    let r = !1;
    if (n && !i) {
      if (e)
        if (Ae(e))
          for (const o of e.split(";")) {
            const l = o.slice(0, o.indexOf(":")).trim();
            n[l] == null && Fs(s, l, "");
          }
        else for (const o in e) n[o] == null && Fs(s, o, "");
      for (const o in n) o === "display" && (r = !0), Fs(s, o, n[o]);
    } else if (i) {
      if (e !== n) {
        const o = s[Pu];
        o && (n += ";" + o), (s.cssText = n), (r = Lu.test(n));
      }
    } else e && t.removeAttribute("style");
    _l in t && ((t[_l] = r ? s.display : ""), t[Mu] && (s.display = "none"));
  }
  const Sl = /\s*!important$/;
  function Fs(t, e, n) {
    if (ne(n)) n.forEach((s) => Fs(t, e, s));
    else if ((n == null && (n = ""), e.startsWith("--"))) t.setProperty(e, n);
    else {
      const s = Ou(t, e);
      Sl.test(n)
        ? t.setProperty(Zt(s), n.replace(Sl, ""), "important")
        : (t[s] = n);
    }
  }
  const El = ["Webkit", "Moz", "ms"],
    Ui = {};
  function Ou(t, e) {
    const n = Ui[e];
    if (n) return n;
    let s = st(e);
    if (s !== "filter" && s in t) return (Ui[e] = s);
    s = fs(s);
    for (let i = 0; i < El.length; i++) {
      const r = El[i] + s;
      if (r in t) return (Ui[e] = r);
    }
    return e;
  }
  const xl = "http://www.w3.org/1999/xlink";
  function Tl(t, e, n, s, i, r = kc(e)) {
    s && e.startsWith("xlink:")
      ? n == null
        ? t.removeAttributeNS(xl, e.slice(6, e.length))
        : t.setAttributeNS(xl, e, n)
      : n == null || (r && !Ir(n))
      ? t.removeAttribute(e)
      : t.setAttribute(e, r ? "" : zt(n) ? String(n) : n);
  }
  function Cl(t, e, n, s, i) {
    if (e === "innerHTML" || e === "textContent") {
      n != null && (t[e] = e === "innerHTML" ? ul(n) : n);
      return;
    }
    const r = t.tagName;
    if (e === "value" && r !== "PROGRESS" && !r.includes("-")) {
      const l = r === "OPTION" ? t.getAttribute("value") || "" : t.value,
        a = n == null ? (t.type === "checkbox" ? "on" : "") : String(n);
      (l !== a || !("_value" in t)) && (t.value = a),
        n == null && t.removeAttribute(e),
        (t._value = n);
      return;
    }
    let o = !1;
    if (n === "" || n == null) {
      const l = typeof t[e];
      l === "boolean"
        ? (n = Ir(n))
        : n == null && l === "string"
        ? ((n = ""), (o = !0))
        : l === "number" && ((n = 0), (o = !0));
    }
    try {
      t[e] = n;
    } catch (l) {}
    o && t.removeAttribute(i || e);
  }
  function ku(t, e, n, s) {
    t.addEventListener(e, n, s);
  }
  function Ru(t, e, n, s) {
    t.removeEventListener(e, n, s);
  }
  const Al = Symbol("_vei");
  function Bu(t, e, n, s, i = null) {
    const r = t[Al] || (t[Al] = {}),
      o = r[e];
    if (s && o) o.value = s;
    else {
      const [l, a] = $u(e);
      if (s) {
        const u = (r[e] = Hu(s, i));
        ku(t, l, u, a);
      } else o && (Ru(t, l, o, a), (r[e] = void 0));
    }
  }
  const Ml = /(?:Once|Passive|Capture)$/;
  function $u(t) {
    let e;
    if (Ml.test(t)) {
      e = {};
      let s;
      for (; (s = t.match(Ml)); )
        (t = t.slice(0, t.length - s[0].length)), (e[s[0].toLowerCase()] = !0);
    }
    return [t[2] === ":" ? t.slice(3) : Zt(t.slice(2)), e];
  }
  let Wi = 0;
  const zu = Promise.resolve(),
    Nu = () => Wi || (zu.then(() => (Wi = 0)), (Wi = Date.now()));
  function Hu(t, e) {
    const n = (s) => {
      if (!s._vts) s._vts = Date.now();
      else if (s._vts <= n.attached) return;
      at(Fu(s, n.value), e, 5, [s]);
    };
    return (n.value = t), (n.attached = Nu()), n;
  }
  function Fu(t, e) {
    if (ne(e)) {
      const n = t.stopImmediatePropagation;
      return (
        (t.stopImmediatePropagation = () => {
          n.call(t), (t._stopped = !0);
        }),
        e.map((s) => (i) => !i._stopped && s && s(i))
      );
    } else return e;
  }
  const Pl = (t) =>
      t.charCodeAt(0) === 111 &&
      t.charCodeAt(1) === 110 &&
      t.charCodeAt(2) > 96 &&
      t.charCodeAt(2) < 123,
    Du = (t, e, n, s, i, r) => {
      const o = i === "svg";
      e === "class"
        ? Au(t, s, o)
        : e === "style"
        ? Iu(t, n, s)
        : cs(e)
        ? ii(e) || Bu(t, e, n, s, r)
        : (
            e[0] === "."
              ? ((e = e.slice(1)), !0)
              : e[0] === "^"
              ? ((e = e.slice(1)), !1)
              : Gu(t, e, s, o)
          )
        ? (Cl(t, e, s),
          !t.tagName.includes("-") &&
            (e === "value" || e === "checked" || e === "selected") &&
            Tl(t, e, s, o, r, e !== "value"))
        : t._isVueCE && (/[A-Z]/.test(e) || !Ae(s))
        ? Cl(t, st(e), s, r, e)
        : (e === "true-value"
            ? (t._trueValue = s)
            : e === "false-value" && (t._falseValue = s),
          Tl(t, e, s, o));
    };
  function Gu(t, e, n, s) {
    if (s)
      return !!(
        e === "innerHTML" ||
        e === "textContent" ||
        (e in t && Pl(e) && ie(n))
      );
    if (
      e === "spellcheck" ||
      e === "draggable" ||
      e === "translate" ||
      e === "autocorrect" ||
      e === "form" ||
      (e === "list" && t.tagName === "INPUT") ||
      (e === "type" && t.tagName === "TEXTAREA")
    )
      return !1;
    if (e === "width" || e === "height") {
      const i = t.tagName;
      if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
        return !1;
    }
    return Pl(e) && Ae(n) ? !1 : e in t;
  }
  const ju = ke({ patchProp: Du }, _u);
  let Ll;
  function Vu() {
    return Ll || (Ll = jd(ju));
  }
  const Uu = (...t) => {
    const e = Vu().createApp(...t),
      { mount: n } = e;
    return (
      (e.mount = (s) => {
        const i = qu(s);
        if (!i) return;
        const r = e._component;
        !ie(r) && !r.render && !r.template && (r.template = i.innerHTML),
          i.nodeType === 1 && (i.textContent = "");
        const o = n(i, !1, Wu(i));
        return (
          i instanceof Element &&
            (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")),
          o
        );
      }),
      e
    );
  };
  function Wu(t) {
    if (t instanceof SVGElement) return "svg";
    if (typeof MathMLElement == "function" && t instanceof MathMLElement)
      return "mathml";
  }
  function qu(t) {
    return Ae(t) ? document.querySelector(t) : t;
  }
  const Ku = "usehead";
  function Yu(t) {
    return {
      install(n) {
        (n.config.globalProperties.$unhead = t),
          (n.config.globalProperties.$head = t),
          n.provide(Ku, t);
      },
    }.install;
  }
  function Qu(t = {}) {
    const e = _c(
      Ie(
        {
          domOptions: {
            render: Sc(
              () => Er(e),
              (n) => setTimeout(n, 0)
            ),
          },
        },
        t
      )
    );
    return (e.install = Yu(e)), e;
  }
  /*!
   * vue-router v4.5.1
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */ const _n = typeof document != "undefined";
  function Il(t) {
    return (
      typeof t == "object" ||
      "displayName" in t ||
      "props" in t ||
      "__vccOpts" in t
    );
  }
  function Xu(t) {
    return (
      t.__esModule ||
      t[Symbol.toStringTag] === "Module" ||
      (t.default && Il(t.default))
    );
  }
  const ve = Object.assign;
  function qi(t, e) {
    const n = {};
    for (const s in e) {
      const i = e[s];
      n[s] = ut(i) ? i.map(t) : t(i);
    }
    return n;
  }
  const Qn = () => {},
    ut = Array.isArray,
    Ol = /#/g,
    Ju = /&/g,
    Zu = /\//g,
    ef = /=/g,
    tf = /\?/g,
    kl = /\+/g,
    nf = /%5B/g,
    sf = /%5D/g,
    Rl = /%5E/g,
    rf = /%60/g,
    Bl = /%7B/g,
    of = /%7C/g,
    $l = /%7D/g,
    lf = /%20/g;
  function Ki(t) {
    return encodeURI("" + t)
      .replace(of, "|")
      .replace(nf, "[")
      .replace(sf, "]");
  }
  function af(t) {
    return Ki(t).replace(Bl, "{").replace($l, "}").replace(Rl, "^");
  }
  function Yi(t) {
    return Ki(t)
      .replace(kl, "%2B")
      .replace(lf, "+")
      .replace(Ol, "%23")
      .replace(Ju, "%26")
      .replace(rf, "`")
      .replace(Bl, "{")
      .replace($l, "}")
      .replace(Rl, "^");
  }
  function cf(t) {
    return Yi(t).replace(ef, "%3D");
  }
  function df(t) {
    return Ki(t).replace(Ol, "%23").replace(tf, "%3F");
  }
  function uf(t) {
    return t == null ? "" : df(t).replace(Zu, "%2F");
  }
  function Xn(t) {
    try {
      return decodeURIComponent("" + t);
    } catch (e) {}
    return "" + t;
  }
  const ff = /\/$/,
    pf = (t) => t.replace(ff, "");
  function Qi(t, e, n = "/") {
    let s,
      i = {},
      r = "",
      o = "";
    const l = e.indexOf("#");
    let a = e.indexOf("?");
    return (
      l < a && l >= 0 && (a = -1),
      a > -1 &&
        ((s = e.slice(0, a)),
        (r = e.slice(a + 1, l > -1 ? l : e.length)),
        (i = t(r))),
      l > -1 && ((s = s || e.slice(0, l)), (o = e.slice(l, e.length))),
      (s = vf(s != null ? s : e, n)),
      { fullPath: s + (r && "?") + r + o, path: s, query: i, hash: Xn(o) }
    );
  }
  function hf(t, e) {
    const n = e.query ? t(e.query) : "";
    return e.path + (n && "?") + n + (e.hash || "");
  }
  function zl(t, e) {
    return !e || !t.toLowerCase().startsWith(e.toLowerCase())
      ? t
      : t.slice(e.length) || "/";
  }
  function gf(t, e, n) {
    const s = e.matched.length - 1,
      i = n.matched.length - 1;
    return (
      s > -1 &&
      s === i &&
      Sn(e.matched[s], n.matched[i]) &&
      Nl(e.params, n.params) &&
      t(e.query) === t(n.query) &&
      e.hash === n.hash
    );
  }
  function Sn(t, e) {
    return (t.aliasOf || t) === (e.aliasOf || e);
  }
  function Nl(t, e) {
    if (Object.keys(t).length !== Object.keys(e).length) return !1;
    for (const n in t) if (!mf(t[n], e[n])) return !1;
    return !0;
  }
  function mf(t, e) {
    return ut(t) ? Hl(t, e) : ut(e) ? Hl(e, t) : t === e;
  }
  function Hl(t, e) {
    return ut(e)
      ? t.length === e.length && t.every((n, s) => n === e[s])
      : t.length === 1 && t[0] === e;
  }
  function vf(t, e) {
    if (t.startsWith("/")) return t;
    if (!t) return e;
    const n = e.split("/"),
      s = t.split("/"),
      i = s[s.length - 1];
    (i === ".." || i === ".") && s.push("");
    let r = n.length - 1,
      o,
      l;
    for (o = 0; o < s.length; o++)
      if (((l = s[o]), l !== "."))
        if (l === "..") r > 1 && r--;
        else break;
    return n.slice(0, r).join("/") + "/" + s.slice(o).join("/");
  }
  const Kt = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0,
  };
  var Jn;
  (function (t) {
    (t.pop = "pop"), (t.push = "push");
  })(Jn || (Jn = {}));
  var Zn;
  (function (t) {
    (t.back = "back"), (t.forward = "forward"), (t.unknown = "");
  })(Zn || (Zn = {}));
  function yf(t) {
    if (!t)
      if (_n) {
        const e = document.querySelector("base");
        (t = (e && e.getAttribute("href")) || "/"),
          (t = t.replace(/^\w+:\/\/[^\/]+/, ""));
      } else t = "/";
    return t[0] !== "/" && t[0] !== "#" && (t = "/" + t), pf(t);
  }
  const bf = /^[^#]+#/;
  function wf(t, e) {
    return t.replace(bf, "#") + e;
  }
  function _f(t, e) {
    const n = document.documentElement.getBoundingClientRect(),
      s = t.getBoundingClientRect();
    return {
      behavior: e.behavior,
      left: s.left - n.left - (e.left || 0),
      top: s.top - n.top - (e.top || 0),
    };
  }
  const Ds = () => ({ left: window.scrollX, top: window.scrollY });
  function Sf(t) {
    let e;
    if ("el" in t) {
      const n = t.el,
        s = typeof n == "string" && n.startsWith("#"),
        i =
          typeof n == "string"
            ? s
              ? document.getElementById(n.slice(1))
              : document.querySelector(n)
            : n;
      if (!i) return;
      e = _f(i, t);
    } else e = t;
    "scrollBehavior" in document.documentElement.style
      ? window.scrollTo(e)
      : window.scrollTo(
          e.left != null ? e.left : window.scrollX,
          e.top != null ? e.top : window.scrollY
        );
  }
  function Fl(t, e) {
    return (history.state ? history.state.position - e : -1) + t;
  }
  const Xi = new Map();
  function Ef(t, e) {
    Xi.set(t, e);
  }
  function xf(t) {
    const e = Xi.get(t);
    return Xi.delete(t), e;
  }
  let Tf = () => location.protocol + "//" + location.host;
  function Dl(t, e) {
    const { pathname: n, search: s, hash: i } = e,
      r = t.indexOf("#");
    if (r > -1) {
      let l = i.includes(t.slice(r)) ? t.slice(r).length : 1,
        a = i.slice(l);
      return a[0] !== "/" && (a = "/" + a), zl(a, "");
    }
    return zl(n, t) + s + i;
  }
  function Cf(t, e, n, s) {
    let i = [],
      r = [],
      o = null;
    const l = ({ state: f }) => {
      const p = Dl(t, location),
        h = n.value,
        m = e.value;
      let b = 0;
      if (f) {
        if (((n.value = p), (e.value = f), o && o === h)) {
          o = null;
          return;
        }
        b = m ? f.position - m.position : 0;
      } else s(p);
      i.forEach((w) => {
        w(n.value, h, {
          delta: b,
          type: Jn.pop,
          direction: b ? (b > 0 ? Zn.forward : Zn.back) : Zn.unknown,
        });
      });
    };
    function a() {
      o = n.value;
    }
    function u(f) {
      i.push(f);
      const p = () => {
        const h = i.indexOf(f);
        h > -1 && i.splice(h, 1);
      };
      return r.push(p), p;
    }
    function c() {
      const { history: f } = window;
      f.state && f.replaceState(ve({}, f.state, { scroll: Ds() }), "");
    }
    function d() {
      for (const f of r) f();
      (r = []),
        window.removeEventListener("popstate", l),
        window.removeEventListener("beforeunload", c);
    }
    return (
      window.addEventListener("popstate", l),
      window.addEventListener("beforeunload", c, { passive: !0 }),
      { pauseListeners: a, listen: u, destroy: d }
    );
  }
  function Gl(t, e, n, s = !1, i = !1) {
    return {
      back: t,
      current: e,
      forward: n,
      replaced: s,
      position: window.history.length,
      scroll: i ? Ds() : null,
    };
  }
  function Af(t) {
    const { history: e, location: n } = window,
      s = { value: Dl(t, n) },
      i = { value: e.state };
    i.value ||
      r(
        s.value,
        {
          back: null,
          current: s.value,
          forward: null,
          position: e.length - 1,
          replaced: !0,
          scroll: null,
        },
        !0
      );
    function r(a, u, c) {
      const d = t.indexOf("#"),
        f =
          d > -1
            ? (n.host && document.querySelector("base") ? t : t.slice(d)) + a
            : Tf() + t + a;
      try {
        e[c ? "replaceState" : "pushState"](u, "", f), (i.value = u);
      } catch (p) {
        console.error(p), n[c ? "replace" : "assign"](f);
      }
    }
    function o(a, u) {
      const c = ve({}, e.state, Gl(i.value.back, a, i.value.forward, !0), u, {
        position: i.value.position,
      });
      r(a, c, !0), (s.value = a);
    }
    function l(a, u) {
      const c = ve({}, i.value, e.state, { forward: a, scroll: Ds() });
      r(c.current, c, !0);
      const d = ve({}, Gl(s.value, a, null), { position: c.position + 1 }, u);
      r(a, d, !1), (s.value = a);
    }
    return { location: s, state: i, push: l, replace: o };
  }
  function Mf(t) {
    t = yf(t);
    const e = Af(t),
      n = Cf(t, e.state, e.location, e.replace);
    function s(r, o = !0) {
      o || n.pauseListeners(), history.go(r);
    }
    const i = ve(
      { location: "", base: t, go: s, createHref: wf.bind(null, t) },
      e,
      n
    );
    return (
      Object.defineProperty(i, "location", {
        enumerable: !0,
        get: () => e.location.value,
      }),
      Object.defineProperty(i, "state", {
        enumerable: !0,
        get: () => e.state.value,
      }),
      i
    );
  }
  function Pf(t) {
    return typeof t == "string" || (t && typeof t == "object");
  }
  function jl(t) {
    return typeof t == "string" || typeof t == "symbol";
  }
  const Vl = Symbol("");
  var Ul;
  (function (t) {
    (t[(t.aborted = 4)] = "aborted"),
      (t[(t.cancelled = 8)] = "cancelled"),
      (t[(t.duplicated = 16)] = "duplicated");
  })(Ul || (Ul = {}));
  function En(t, e) {
    return ve(new Error(), { type: t, [Vl]: !0 }, e);
  }
  function Rt(t, e) {
    return t instanceof Error && Vl in t && (e == null || !!(t.type & e));
  }
  const Wl = "[^/]+?",
    Lf = { sensitive: !1, strict: !1, start: !0, end: !0 },
    If = /[.+*?^${}()[\]/\\]/g;
  function Of(t, e) {
    const n = ve({}, Lf, e),
      s = [];
    let i = n.start ? "^" : "";
    const r = [];
    for (const u of t) {
      const c = u.length ? [] : [90];
      n.strict && !u.length && (i += "/");
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        let p = 40 + (n.sensitive ? 0.25 : 0);
        if (f.type === 0)
          d || (i += "/"), (i += f.value.replace(If, "\\$&")), (p += 40);
        else if (f.type === 1) {
          const { value: h, repeatable: m, optional: b, regexp: w } = f;
          r.push({ name: h, repeatable: m, optional: b });
          const g = w || Wl;
          if (g !== Wl) {
            p += 10;
            try {
              new RegExp(`(${g})`);
            } catch (E) {
              throw new Error(
                `Invalid custom RegExp for param "${h}" (${g}): ` + E.message
              );
            }
          }
          let y = m ? `((?:${g})(?:/(?:${g}))*)` : `(${g})`;
          d || (y = b && u.length < 2 ? `(?:/${y})` : "/" + y),
            b && (y += "?"),
            (i += y),
            (p += 20),
            b && (p += -8),
            m && (p += -20),
            g === ".*" && (p += -50);
        }
        c.push(p);
      }
      s.push(c);
    }
    if (n.strict && n.end) {
      const u = s.length - 1;
      s[u][s[u].length - 1] += 0.7000000000000001;
    }
    n.strict || (i += "/?"),
      n.end ? (i += "$") : n.strict && !i.endsWith("/") && (i += "(?:/|$)");
    const o = new RegExp(i, n.sensitive ? "" : "i");
    function l(u) {
      const c = u.match(o),
        d = {};
      if (!c) return null;
      for (let f = 1; f < c.length; f++) {
        const p = c[f] || "",
          h = r[f - 1];
        d[h.name] = p && h.repeatable ? p.split("/") : p;
      }
      return d;
    }
    function a(u) {
      let c = "",
        d = !1;
      for (const f of t) {
        (!d || !c.endsWith("/")) && (c += "/"), (d = !1);
        for (const p of f)
          if (p.type === 0) c += p.value;
          else if (p.type === 1) {
            const { value: h, repeatable: m, optional: b } = p,
              w = h in u ? u[h] : "";
            if (ut(w) && !m)
              throw new Error(
                `Provided param "${h}" is an array but it is not repeatable (* or + modifiers)`
              );
            const g = ut(w) ? w.join("/") : w;
            if (!g)
              if (b)
                f.length < 2 &&
                  (c.endsWith("/") ? (c = c.slice(0, -1)) : (d = !0));
              else throw new Error(`Missing required param "${h}"`);
            c += g;
          }
      }
      return c || "/";
    }
    return { re: o, score: s, keys: r, parse: l, stringify: a };
  }
  function kf(t, e) {
    let n = 0;
    for (; n < t.length && n < e.length; ) {
      const s = e[n] - t[n];
      if (s) return s;
      n++;
    }
    return t.length < e.length
      ? t.length === 1 && t[0] === 80
        ? -1
        : 1
      : t.length > e.length
      ? e.length === 1 && e[0] === 80
        ? 1
        : -1
      : 0;
  }
  function ql(t, e) {
    let n = 0;
    const s = t.score,
      i = e.score;
    for (; n < s.length && n < i.length; ) {
      const r = kf(s[n], i[n]);
      if (r) return r;
      n++;
    }
    if (Math.abs(i.length - s.length) === 1) {
      if (Kl(s)) return 1;
      if (Kl(i)) return -1;
    }
    return i.length - s.length;
  }
  function Kl(t) {
    const e = t[t.length - 1];
    return t.length > 0 && e[e.length - 1] < 0;
  }
  const Rf = { type: 0, value: "" },
    Bf = /[a-zA-Z0-9_]/;
  function $f(t) {
    if (!t) return [[]];
    if (t === "/") return [[Rf]];
    if (!t.startsWith("/")) throw new Error(`Invalid path "${t}"`);
    function e(p) {
      throw new Error(`ERR (${n})/"${u}": ${p}`);
    }
    let n = 0,
      s = n;
    const i = [];
    let r;
    function o() {
      r && i.push(r), (r = []);
    }
    let l = 0,
      a,
      u = "",
      c = "";
    function d() {
      u &&
        (n === 0
          ? r.push({ type: 0, value: u })
          : n === 1 || n === 2 || n === 3
          ? (r.length > 1 &&
              (a === "*" || a === "+") &&
              e(
                `A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`
              ),
            r.push({
              type: 1,
              value: u,
              regexp: c,
              repeatable: a === "*" || a === "+",
              optional: a === "*" || a === "?",
            }))
          : e("Invalid state to consume buffer"),
        (u = ""));
    }
    function f() {
      u += a;
    }
    for (; l < t.length; ) {
      if (((a = t[l++]), a === "\\" && n !== 2)) {
        (s = n), (n = 4);
        continue;
      }
      switch (n) {
        case 0:
          a === "/" ? (u && d(), o()) : a === ":" ? (d(), (n = 1)) : f();
          break;
        case 4:
          f(), (n = s);
          break;
        case 1:
          a === "("
            ? (n = 2)
            : Bf.test(a)
            ? f()
            : (d(), (n = 0), a !== "*" && a !== "?" && a !== "+" && l--);
          break;
        case 2:
          a === ")"
            ? c[c.length - 1] == "\\"
              ? (c = c.slice(0, -1) + a)
              : (n = 3)
            : (c += a);
          break;
        case 3:
          d(), (n = 0), a !== "*" && a !== "?" && a !== "+" && l--, (c = "");
          break;
        default:
          e("Unknown state");
          break;
      }
    }
    return (
      n === 2 && e(`Unfinished custom RegExp for param "${u}"`), d(), o(), i
    );
  }
  function zf(t, e, n) {
    const s = Of($f(t.path), n),
      i = ve(s, { record: t, parent: e, children: [], alias: [] });
    return e && !i.record.aliasOf == !e.record.aliasOf && e.children.push(i), i;
  }
  function Nf(t, e) {
    const n = [],
      s = new Map();
    e = Jl({ strict: !1, end: !0, sensitive: !1 }, e);
    function i(d) {
      return s.get(d);
    }
    function r(d, f, p) {
      const h = !p,
        m = Ql(d);
      m.aliasOf = p && p.record;
      const b = Jl(e, d),
        w = [m];
      if ("alias" in d) {
        const E = typeof d.alias == "string" ? [d.alias] : d.alias;
        for (const C of E)
          w.push(
            Ql(
              ve({}, m, {
                components: p ? p.record.components : m.components,
                path: C,
                aliasOf: p ? p.record : m,
              })
            )
          );
      }
      let g, y;
      for (const E of w) {
        const { path: C } = E;
        if (f && C[0] !== "/") {
          const O = f.record.path,
            z = O[O.length - 1] === "/" ? "" : "/";
          E.path = f.record.path + (C && z + C);
        }
        if (
          ((g = zf(E, f, b)),
          p
            ? p.alias.push(g)
            : ((y = y || g),
              y !== g && y.alias.push(g),
              h && d.name && !Xl(g) && o(d.name)),
          Zl(g) && a(g),
          m.children)
        ) {
          const O = m.children;
          for (let z = 0; z < O.length; z++) r(O[z], g, p && p.children[z]);
        }
        p = p || g;
      }
      return y
        ? () => {
            o(y);
          }
        : Qn;
    }
    function o(d) {
      if (jl(d)) {
        const f = s.get(d);
        f &&
          (s.delete(d),
          n.splice(n.indexOf(f), 1),
          f.children.forEach(o),
          f.alias.forEach(o));
      } else {
        const f = n.indexOf(d);
        f > -1 &&
          (n.splice(f, 1),
          d.record.name && s.delete(d.record.name),
          d.children.forEach(o),
          d.alias.forEach(o));
      }
    }
    function l() {
      return n;
    }
    function a(d) {
      const f = Df(d, n);
      n.splice(f, 0, d), d.record.name && !Xl(d) && s.set(d.record.name, d);
    }
    function u(d, f) {
      let p,
        h = {},
        m,
        b;
      if ("name" in d && d.name) {
        if (((p = s.get(d.name)), !p)) throw En(1, { location: d });
        (b = p.record.name),
          (h = ve(
            Yl(
              f.params,
              p.keys
                .filter((y) => !y.optional)
                .concat(p.parent ? p.parent.keys.filter((y) => y.optional) : [])
                .map((y) => y.name)
            ),
            d.params &&
              Yl(
                d.params,
                p.keys.map((y) => y.name)
              )
          )),
          (m = p.stringify(h));
      } else if (d.path != null)
        (m = d.path),
          (p = n.find((y) => y.re.test(m))),
          p && ((h = p.parse(m)), (b = p.record.name));
      else {
        if (
          ((p = f.name ? s.get(f.name) : n.find((y) => y.re.test(f.path))), !p)
        )
          throw En(1, { location: d, currentLocation: f });
        (b = p.record.name),
          (h = ve({}, f.params, d.params)),
          (m = p.stringify(h));
      }
      const w = [];
      let g = p;
      for (; g; ) w.unshift(g.record), (g = g.parent);
      return { name: b, path: m, params: h, matched: w, meta: Ff(w) };
    }
    t.forEach((d) => r(d));
    function c() {
      (n.length = 0), s.clear();
    }
    return {
      addRoute: r,
      resolve: u,
      removeRoute: o,
      clearRoutes: c,
      getRoutes: l,
      getRecordMatcher: i,
    };
  }
  function Yl(t, e) {
    const n = {};
    for (const s of e) s in t && (n[s] = t[s]);
    return n;
  }
  function Ql(t) {
    const e = {
      path: t.path,
      redirect: t.redirect,
      name: t.name,
      meta: t.meta || {},
      aliasOf: t.aliasOf,
      beforeEnter: t.beforeEnter,
      props: Hf(t),
      children: t.children || [],
      instances: {},
      leaveGuards: new Set(),
      updateGuards: new Set(),
      enterCallbacks: {},
      components:
        "components" in t
          ? t.components || null
          : t.component && { default: t.component },
    };
    return Object.defineProperty(e, "mods", { value: {} }), e;
  }
  function Hf(t) {
    const e = {},
      n = t.props || !1;
    if ("component" in t) e.default = n;
    else for (const s in t.components) e[s] = typeof n == "object" ? n[s] : n;
    return e;
  }
  function Xl(t) {
    for (; t; ) {
      if (t.record.aliasOf) return !0;
      t = t.parent;
    }
    return !1;
  }
  function Ff(t) {
    return t.reduce((e, n) => ve(e, n.meta), {});
  }
  function Jl(t, e) {
    const n = {};
    for (const s in t) n[s] = s in e ? e[s] : t[s];
    return n;
  }
  function Df(t, e) {
    let n = 0,
      s = e.length;
    for (; n !== s; ) {
      const r = (n + s) >> 1;
      ql(t, e[r]) < 0 ? (s = r) : (n = r + 1);
    }
    const i = Gf(t);
    return i && (s = e.lastIndexOf(i, s - 1)), s;
  }
  function Gf(t) {
    let e = t;
    for (; (e = e.parent); ) if (Zl(e) && ql(t, e) === 0) return e;
  }
  function Zl({ record: t }) {
    return !!(
      t.name ||
      (t.components && Object.keys(t.components).length) ||
      t.redirect
    );
  }
  function jf(t) {
    const e = {};
    if (t === "" || t === "?") return e;
    const s = (t[0] === "?" ? t.slice(1) : t).split("&");
    for (let i = 0; i < s.length; ++i) {
      const r = s[i].replace(kl, " "),
        o = r.indexOf("="),
        l = Xn(o < 0 ? r : r.slice(0, o)),
        a = o < 0 ? null : Xn(r.slice(o + 1));
      if (l in e) {
        let u = e[l];
        ut(u) || (u = e[l] = [u]), u.push(a);
      } else e[l] = a;
    }
    return e;
  }
  function ea(t) {
    let e = "";
    for (let n in t) {
      const s = t[n];
      if (((n = cf(n)), s == null)) {
        s !== void 0 && (e += (e.length ? "&" : "") + n);
        continue;
      }
      (ut(s) ? s.map((r) => r && Yi(r)) : [s && Yi(s)]).forEach((r) => {
        r !== void 0 &&
          ((e += (e.length ? "&" : "") + n), r != null && (e += "=" + r));
      });
    }
    return e;
  }
  function Vf(t) {
    const e = {};
    for (const n in t) {
      const s = t[n];
      s !== void 0 &&
        (e[n] = ut(s)
          ? s.map((i) => (i == null ? null : "" + i))
          : s == null
          ? s
          : "" + s);
    }
    return e;
  }
  const Uf = Symbol(""),
    ta = Symbol(""),
    Gs = Symbol(""),
    Ji = Symbol(""),
    Zi = Symbol("");
  function es() {
    let t = [];
    function e(s) {
      return (
        t.push(s),
        () => {
          const i = t.indexOf(s);
          i > -1 && t.splice(i, 1);
        }
      );
    }
    function n() {
      t = [];
    }
    return { add: e, list: () => t.slice(), reset: n };
  }
  function Yt(t, e, n, s, i, r = (o) => o()) {
    const o = s && (s.enterCallbacks[i] = s.enterCallbacks[i] || []);
    return () =>
      new Promise((l, a) => {
        const u = (f) => {
            f === !1
              ? a(En(4, { from: n, to: e }))
              : f instanceof Error
              ? a(f)
              : Pf(f)
              ? a(En(2, { from: e, to: f }))
              : (o &&
                  s.enterCallbacks[i] === o &&
                  typeof f == "function" &&
                  o.push(f),
                l());
          },
          c = r(() => t.call(s && s.instances[i], e, n, u));
        let d = Promise.resolve(c);
        t.length < 3 && (d = d.then(u)), d.catch((f) => a(f));
      });
  }
  function er(t, e, n, s, i = (r) => r()) {
    const r = [];
    for (const o of t)
      for (const l in o.components) {
        let a = o.components[l];
        if (!(e !== "beforeRouteEnter" && !o.instances[l]))
          if (Il(a)) {
            const c = (a.__vccOpts || a)[e];
            c && r.push(Yt(c, n, s, o, l, i));
          } else {
            let u = a();
            r.push(() =>
              u.then((c) => {
                if (!c)
                  throw new Error(
                    `Couldn't resolve component "${l}" at "${o.path}"`
                  );
                const d = Xu(c) ? c.default : c;
                (o.mods[l] = c), (o.components[l] = d);
                const p = (d.__vccOpts || d)[e];
                return p && Yt(p, n, s, o, l, i)();
              })
            );
          }
      }
    return r;
  }
  function na(t) {
    const e = dt(Gs),
      n = dt(Ji),
      s = ze(() => {
        const a = te(t.to);
        return e.resolve(a);
      }),
      i = ze(() => {
        const { matched: a } = s.value,
          { length: u } = a,
          c = a[u - 1],
          d = n.matched;
        if (!c || !d.length) return -1;
        const f = d.findIndex(Sn.bind(null, c));
        if (f > -1) return f;
        const p = sa(a[u - 2]);
        return u > 1 && sa(c) === p && d[d.length - 1].path !== p
          ? d.findIndex(Sn.bind(null, a[u - 2]))
          : f;
      }),
      r = ze(() => i.value > -1 && Yf(n.params, s.value.params)),
      o = ze(
        () =>
          i.value > -1 &&
          i.value === n.matched.length - 1 &&
          Nl(n.params, s.value.params)
      );
    function l(a = {}) {
      if (Kf(a)) {
        const u = e[te(t.replace) ? "replace" : "push"](te(t.to)).catch(Qn);
        return (
          t.viewTransition &&
            typeof document != "undefined" &&
            "startViewTransition" in document &&
            document.startViewTransition(() => u),
          u
        );
      }
      return Promise.resolve();
    }
    return {
      route: s,
      href: ze(() => s.value.href),
      isActive: r,
      isExactActive: o,
      navigate: l,
    };
  }
  function Wf(t) {
    return t.length === 1 ? t[0] : t;
  }
  const qf = Mi({
    name: "RouterLink",
    compatConfig: { MODE: 3 },
    props: {
      to: { type: [String, Object], required: !0 },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: { type: String, default: "page" },
      viewTransition: Boolean,
    },
    useLink: na,
    setup(t, { slots: e }) {
      const n = ys(na(t)),
        { options: s } = dt(Gs),
        i = ze(() => ({
          [ia(t.activeClass, s.linkActiveClass, "router-link-active")]:
            n.isActive,
          [ia(
            t.exactActiveClass,
            s.linkExactActiveClass,
            "router-link-exact-active"
          )]: n.isExactActive,
        }));
      return () => {
        const r = e.default && Wf(e.default(n));
        return t.custom
          ? r
          : We(
              "a",
              {
                "aria-current": n.isExactActive ? t.ariaCurrentValue : null,
                href: n.href,
                onClick: n.navigate,
                class: i.value,
              },
              r
            );
      };
    },
  });
  function Kf(t) {
    if (
      !(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey) &&
      !t.defaultPrevented &&
      !(t.button !== void 0 && t.button !== 0)
    ) {
      if (t.currentTarget && t.currentTarget.getAttribute) {
        const e = t.currentTarget.getAttribute("target");
        if (/\b_blank\b/i.test(e)) return;
      }
      return t.preventDefault && t.preventDefault(), !0;
    }
  }
  function Yf(t, e) {
    for (const n in e) {
      const s = e[n],
        i = t[n];
      if (typeof s == "string") {
        if (s !== i) return !1;
      } else if (
        !ut(i) ||
        i.length !== s.length ||
        s.some((r, o) => r !== i[o])
      )
        return !1;
    }
    return !0;
  }
  function sa(t) {
    return t ? (t.aliasOf ? t.aliasOf.path : t.path) : "";
  }
  const ia = (t, e, n) => (t != null ? t : e != null ? e : n),
    Qf = Mi({
      name: "RouterView",
      inheritAttrs: !1,
      props: { name: { type: String, default: "default" }, route: Object },
      compatConfig: { MODE: 3 },
      setup(t, { attrs: e, slots: n }) {
        const s = dt(Zi),
          i = ze(() => t.route || s.value),
          r = dt(ta, 0),
          o = ze(() => {
            let u = te(r);
            const { matched: c } = i.value;
            let d;
            for (; (d = c[u]) && !d.components; ) u++;
            return u;
          }),
          l = ze(() => i.value.matched[o.value]);
        wn(
          ta,
          ze(() => o.value + 1)
        ),
          wn(Uf, l),
          wn(Zi, i);
        const a = ae();
        return (
          jt(
            () => [a.value, l.value, t.name],
            ([u, c, d], [f, p, h]) => {
              c &&
                ((c.instances[d] = u),
                p &&
                  p !== c &&
                  u &&
                  u === f &&
                  (c.leaveGuards.size || (c.leaveGuards = p.leaveGuards),
                  c.updateGuards.size || (c.updateGuards = p.updateGuards))),
                u &&
                  c &&
                  (!p || !Sn(c, p) || !f) &&
                  (c.enterCallbacks[d] || []).forEach((m) => m(u));
            },
            { flush: "post" }
          ),
          () => {
            const u = i.value,
              c = t.name,
              d = l.value,
              f = d && d.components[c];
            if (!f) return ra(n.default, { Component: f, route: u });
            const p = d.props[c],
              h = p
                ? p === !0
                  ? u.params
                  : typeof p == "function"
                  ? p(u)
                  : p
                : null,
              b = We(
                f,
                ve({}, h, e, {
                  onVnodeUnmounted: (w) => {
                    w.component.isUnmounted && (d.instances[c] = null);
                  },
                  ref: a,
                })
              );
            return ra(n.default, { Component: b, route: u }) || b;
          }
        );
      },
    });
  function ra(t, e) {
    if (!t) return null;
    const n = t(e);
    return n.length === 1 ? n[0] : n;
  }
  const Xf = Qf;
  function Jf(t) {
    const e = Nf(t.routes, t),
      n = t.parseQuery || jf,
      s = t.stringifyQuery || ea,
      i = t.history,
      r = es(),
      o = es(),
      l = es(),
      a = td(Kt);
    let u = Kt;
    _n &&
      t.scrollBehavior &&
      "scrollRestoration" in history &&
      (history.scrollRestoration = "manual");
    const c = qi.bind(null, (k) => "" + k),
      d = qi.bind(null, uf),
      f = qi.bind(null, Xn);
    function p(k, q) {
      let V, Q;
      return (
        jl(k) ? ((V = e.getRecordMatcher(k)), (Q = q)) : (Q = k),
        e.addRoute(Q, V)
      );
    }
    function h(k) {
      const q = e.getRecordMatcher(k);
      q && e.removeRoute(q);
    }
    function m() {
      return e.getRoutes().map((k) => k.record);
    }
    function b(k) {
      return !!e.getRecordMatcher(k);
    }
    function w(k, q) {
      if (((q = ve({}, q || a.value)), typeof k == "string")) {
        const x = Qi(n, k, q.path),
          I = e.resolve({ path: x.path }, q),
          B = i.createHref(x.fullPath);
        return ve(x, I, {
          params: f(I.params),
          hash: Xn(x.hash),
          redirectedFrom: void 0,
          href: B,
        });
      }
      let V;
      if (k.path != null) V = ve({}, k, { path: Qi(n, k.path, q.path).path });
      else {
        const x = ve({}, k.params);
        for (const I in x) x[I] == null && delete x[I];
        (V = ve({}, k, { params: d(x) })), (q.params = d(q.params));
      }
      const Q = e.resolve(V, q),
        be = k.hash || "";
      Q.params = c(f(Q.params));
      const _ = hf(s, ve({}, k, { hash: af(be), path: Q.path })),
        S = i.createHref(_);
      return ve(
        {
          fullPath: _,
          hash: be,
          query: s === ea ? Vf(k.query) : k.query || {},
        },
        Q,
        { redirectedFrom: void 0, href: S }
      );
    }
    function g(k) {
      return typeof k == "string" ? Qi(n, k, a.value.path) : ve({}, k);
    }
    function y(k, q) {
      if (u !== k) return En(8, { from: q, to: k });
    }
    function E(k) {
      return z(k);
    }
    function C(k) {
      return E(ve(g(k), { replace: !0 }));
    }
    function O(k) {
      const q = k.matched[k.matched.length - 1];
      if (q && q.redirect) {
        const { redirect: V } = q;
        let Q = typeof V == "function" ? V(k) : V;
        return (
          typeof Q == "string" &&
            ((Q =
              Q.includes("?") || Q.includes("#") ? (Q = g(Q)) : { path: Q }),
            (Q.params = {})),
          ve(
            {
              query: k.query,
              hash: k.hash,
              params: Q.path != null ? {} : k.params,
            },
            Q
          )
        );
      }
    }
    function z(k, q) {
      const V = (u = w(k)),
        Q = a.value,
        be = k.state,
        _ = k.force,
        S = k.replace === !0,
        x = O(V);
      if (x)
        return z(
          ve(g(x), {
            state: typeof x == "object" ? ve({}, be, x.state) : be,
            force: _,
            replace: S,
          }),
          q || V
        );
      const I = V;
      I.redirectedFrom = q;
      let B;
      return (
        !_ &&
          gf(s, Q, V) &&
          ((B = En(16, { to: I, from: Q })), Ce(Q, Q, !0, !1)),
        (B ? Promise.resolve(B) : P(I, Q))
          .catch((L) => (Rt(L) ? (Rt(L, 2) ? L : le(L)) : M(L, I, Q)))
          .then((L) => {
            if (L) {
              if (Rt(L, 2))
                return z(
                  ve({ replace: S }, g(L.to), {
                    state:
                      typeof L.to == "object" ? ve({}, be, L.to.state) : be,
                    force: _,
                  }),
                  q || I
                );
            } else L = R(I, Q, !0, S, be);
            return $(I, Q, L), L;
          })
      );
    }
    function N(k, q) {
      const V = y(k, q);
      return V ? Promise.reject(V) : Promise.resolve();
    }
    function T(k) {
      const q = cn.values().next().value;
      return q && typeof q.runWithContext == "function"
        ? q.runWithContext(k)
        : k();
    }
    function P(k, q) {
      let V;
      const [Q, be, _] = Zf(k, q);
      V = er(Q.reverse(), "beforeRouteLeave", k, q);
      for (const x of Q)
        x.leaveGuards.forEach((I) => {
          V.push(Yt(I, k, q));
        });
      const S = N.bind(null, k, q);
      return (
        V.push(S),
        Qe(V)
          .then(() => {
            V = [];
            for (const x of r.list()) V.push(Yt(x, k, q));
            return V.push(S), Qe(V);
          })
          .then(() => {
            V = er(be, "beforeRouteUpdate", k, q);
            for (const x of be)
              x.updateGuards.forEach((I) => {
                V.push(Yt(I, k, q));
              });
            return V.push(S), Qe(V);
          })
          .then(() => {
            V = [];
            for (const x of _)
              if (x.beforeEnter)
                if (ut(x.beforeEnter))
                  for (const I of x.beforeEnter) V.push(Yt(I, k, q));
                else V.push(Yt(x.beforeEnter, k, q));
            return V.push(S), Qe(V);
          })
          .then(
            () => (
              k.matched.forEach((x) => (x.enterCallbacks = {})),
              (V = er(_, "beforeRouteEnter", k, q, T)),
              V.push(S),
              Qe(V)
            )
          )
          .then(() => {
            V = [];
            for (const x of o.list()) V.push(Yt(x, k, q));
            return V.push(S), Qe(V);
          })
          .catch((x) => (Rt(x, 8) ? x : Promise.reject(x)))
      );
    }
    function $(k, q, V) {
      l.list().forEach((Q) => T(() => Q(k, q, V)));
    }
    function R(k, q, V, Q, be) {
      const _ = y(k, q);
      if (_) return _;
      const S = q === Kt,
        x = _n ? history.state : {};
      V &&
        (Q || S
          ? i.replace(k.fullPath, ve({ scroll: S && x && x.scroll }, be))
          : i.push(k.fullPath, be)),
        (a.value = k),
        Ce(k, q, V, S),
        le();
    }
    let G;
    function ee() {
      G ||
        (G = i.listen((k, q, V) => {
          if (!Bt.listening) return;
          const Q = w(k),
            be = O(Q);
          if (be) {
            z(ve(be, { replace: !0, force: !0 }), Q).catch(Qn);
            return;
          }
          u = Q;
          const _ = a.value;
          _n && Ef(Fl(_.fullPath, V.delta), Ds()),
            P(Q, _)
              .catch((S) =>
                Rt(S, 12)
                  ? S
                  : Rt(S, 2)
                  ? (z(ve(g(S.to), { force: !0 }), Q)
                      .then((x) => {
                        Rt(x, 20) &&
                          !V.delta &&
                          V.type === Jn.pop &&
                          i.go(-1, !1);
                      })
                      .catch(Qn),
                    Promise.reject())
                  : (V.delta && i.go(-V.delta, !1), M(S, Q, _))
              )
              .then((S) => {
                (S = S || R(Q, _, !1)),
                  S &&
                    (V.delta && !Rt(S, 8)
                      ? i.go(-V.delta, !1)
                      : V.type === Jn.pop && Rt(S, 20) && i.go(-1, !1)),
                  $(Q, _, S);
              })
              .catch(Qn);
        }));
    }
    let re = es(),
      W = es(),
      A;
    function M(k, q, V) {
      le(k);
      const Q = W.list();
      return (
        Q.length ? Q.forEach((be) => be(k, q, V)) : console.error(k),
        Promise.reject(k)
      );
    }
    function Y() {
      return A && a.value !== Kt
        ? Promise.resolve()
        : new Promise((k, q) => {
            re.add([k, q]);
          });
    }
    function le(k) {
      return (
        A ||
          ((A = !k),
          ee(),
          re.list().forEach(([q, V]) => (k ? V(k) : q())),
          re.reset()),
        k
      );
    }
    function Ce(k, q, V, Q) {
      const { scrollBehavior: be } = t;
      if (!_n || !be) return Promise.resolve();
      const _ =
        (!V && xf(Fl(k.fullPath, 0))) ||
        ((Q || !V) && history.state && history.state.scroll) ||
        null;
      return Bn()
        .then(() => be(k, q, _))
        .then((S) => S && Sf(S))
        .catch((S) => M(S, k, q));
    }
    const Ee = (k) => i.go(k);
    let ft;
    const cn = new Set(),
      Bt = {
        currentRoute: a,
        listening: !0,
        addRoute: p,
        removeRoute: h,
        clearRoutes: e.clearRoutes,
        hasRoute: b,
        getRoutes: m,
        resolve: w,
        options: t,
        push: E,
        replace: C,
        go: Ee,
        back: () => Ee(-1),
        forward: () => Ee(1),
        beforeEach: r.add,
        beforeResolve: o.add,
        afterEach: l.add,
        onError: W.add,
        isReady: Y,
        install(k) {
          const q = this;
          k.component("RouterLink", qf),
            k.component("RouterView", Xf),
            (k.config.globalProperties.$router = q),
            Object.defineProperty(k.config.globalProperties, "$route", {
              enumerable: !0,
              get: () => te(a),
            }),
            _n &&
              !ft &&
              a.value === Kt &&
              ((ft = !0), E(i.location).catch((be) => {}));
          const V = {};
          for (const be in Kt)
            Object.defineProperty(V, be, {
              get: () => a.value[be],
              enumerable: !0,
            });
          k.provide(Gs, q), k.provide(Ji, Jr(V)), k.provide(Zi, a);
          const Q = k.unmount;
          cn.add(k),
            (k.unmount = function () {
              cn.delete(k),
                cn.size < 1 &&
                  ((u = Kt),
                  G && G(),
                  (G = null),
                  (a.value = Kt),
                  (ft = !1),
                  (A = !1)),
                Q();
            });
        },
      };
    function Qe(k) {
      return k.reduce((q, V) => q.then(() => T(V)), Promise.resolve());
    }
    return Bt;
  }
  function Zf(t, e) {
    const n = [],
      s = [],
      i = [],
      r = Math.max(e.matched.length, t.matched.length);
    for (let o = 0; o < r; o++) {
      const l = e.matched[o];
      l && (t.matched.find((u) => Sn(u, l)) ? s.push(l) : n.push(l));
      const a = t.matched[o];
      a && (e.matched.find((u) => Sn(u, a)) || i.push(a));
    }
    return [n, s, i];
  }
  function oa() {
    return dt(Gs);
  }
  function js(t) {
    return dt(Ji);
  }
  function ep(t) {
    return document.readyState === "loading"
      ? new Promise((e) => {
          document.addEventListener("DOMContentLoaded", () => e(t));
        })
      : Promise.resolve(t);
  }
  const tp = Mi({
    setup(t, { slots: e }) {
      const n = ae(!1);
      return (
        It(() => (n.value = !0)),
        () =>
          n.value
            ? e.default && e.default({})
            : e.placeholder && e.placeholder({})
      );
    },
  });
  function np(t) {
    try {
      return JSON.parse(t || "{}");
    } catch (e) {
      return console.error("[SSG] On state deserialization -", e, t), {};
    }
  }
  function sp(t, e, n, s) {
    const {
      transformState: i,
      registerComponents: r = !0,
      useHead: o = !0,
      rootContainer: l = "#app",
    } = {};
    function a(u) {
      return Tt(this, null, function* () {
        const c = Uu(t);
        let d;
        o && c.use((d = Qu()));
        const f = Jf(Ie({ history: Mf(e.base) }, e)),
          { routes: p } = e;
        r && c.component("ClientOnly", tp);
        const h = [],
          w = {
            app: c,
            head: d,
            isClient: !0,
            router: f,
            routes: p,
            onSSRAppRendered: () => {},
            triggerOnSSRAppRendered: () => Promise.all(h.map((C) => C())),
            initialState: {},
            transformState: i,
            routePath: u,
          };
        yield ep(),
          (w.initialState =
            (i == null ? void 0 : i(window.__INITIAL_STATE__ || {})) ||
            np(window.__INITIAL_STATE__)),
          yield n == null ? void 0 : n(w),
          c.use(f);
        let g,
          y = !0;
        f.beforeEach((C, O, z) => {
          (y || (g && g === C.path)) &&
            ((y = !1), (g = C.path), (C.meta.state = w.initialState)),
            z();
        });
        const E = w.initialState;
        return xt(Ie({}, w), { initialState: E });
      });
    }
    return (
      Tt(null, null, function* () {
        const { app: u, router: c } = yield a();
        yield c.isReady(), u.mount(l, !0);
      }),
      a
    );
  }
  function la(t) {
    return (
      t !== null &&
      typeof t == "object" &&
      "constructor" in t &&
      t.constructor === Object
    );
  }
  function tr(t, e) {
    t === void 0 && (t = {}), e === void 0 && (e = {});
    const n = ["__proto__", "constructor", "prototype"];
    Object.keys(e)
      .filter((s) => n.indexOf(s) < 0)
      .forEach((s) => {
        typeof t[s] == "undefined"
          ? (t[s] = e[s])
          : la(e[s]) &&
            la(t[s]) &&
            Object.keys(e[s]).length > 0 &&
            tr(t[s], e[s]);
      });
  }
  const aa = {
    body: {},
    addEventListener() {},
    removeEventListener() {},
    activeElement: { blur() {}, nodeName: "" },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    createEvent() {
      return { initEvent() {} };
    },
    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute() {},
        getElementsByTagName() {
          return [];
        },
      };
    },
    createElementNS() {
      return {};
    },
    importNode() {
      return null;
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
  };
  function ot() {
    const t = typeof document != "undefined" ? document : {};
    return tr(t, aa), t;
  }
  const ip = {
    document: aa,
    navigator: { userAgent: "" },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
    history: { replaceState() {}, pushState() {}, go() {}, back() {} },
    CustomEvent: function () {
      return this;
    },
    addEventListener() {},
    removeEventListener() {},
    getComputedStyle() {
      return {
        getPropertyValue() {
          return "";
        },
      };
    },
    Image() {},
    Date() {},
    screen: {},
    setTimeout() {},
    clearTimeout() {},
    matchMedia() {
      return {};
    },
    requestAnimationFrame(t) {
      return typeof setTimeout == "undefined" ? (t(), null) : setTimeout(t, 0);
    },
    cancelAnimationFrame(t) {
      typeof setTimeout != "undefined" && clearTimeout(t);
    },
  };
  function qe() {
    const t = typeof window != "undefined" ? window : {};
    return tr(t, ip), t;
  }
  function rp(t) {
    return (
      t === void 0 && (t = ""),
      t
        .trim()
        .split(" ")
        .filter((e) => !!e.trim())
    );
  }
  function op(t) {
    const e = t;
    Object.keys(e).forEach((n) => {
      try {
        e[n] = null;
      } catch (s) {}
      try {
        delete e[n];
      } catch (s) {}
    });
  }
  function ca(t, e) {
    return e === void 0 && (e = 0), setTimeout(t, e);
  }
  function Vs() {
    return Date.now();
  }
  function lp(t) {
    const e = qe();
    let n;
    return (
      e.getComputedStyle && (n = e.getComputedStyle(t, null)),
      !n && t.currentStyle && (n = t.currentStyle),
      n || (n = t.style),
      n
    );
  }
  function ap(t, e) {
    e === void 0 && (e = "x");
    const n = qe();
    let s, i, r;
    const o = lp(t);
    return (
      n.WebKitCSSMatrix
        ? ((i = o.transform || o.webkitTransform),
          i.split(",").length > 6 &&
            (i = i
              .split(", ")
              .map((l) => l.replace(",", "."))
              .join(", ")),
          (r = new n.WebKitCSSMatrix(i === "none" ? "" : i)))
        : ((r =
            o.MozTransform ||
            o.OTransform ||
            o.MsTransform ||
            o.msTransform ||
            o.transform ||
            o
              .getPropertyValue("transform")
              .replace("translate(", "matrix(1, 0, 0, 1,")),
          (s = r.toString().split(","))),
      e === "x" &&
        (n.WebKitCSSMatrix
          ? (i = r.m41)
          : s.length === 16
          ? (i = parseFloat(s[12]))
          : (i = parseFloat(s[4]))),
      e === "y" &&
        (n.WebKitCSSMatrix
          ? (i = r.m42)
          : s.length === 16
          ? (i = parseFloat(s[13]))
          : (i = parseFloat(s[5]))),
      i || 0
    );
  }
  function Us(t) {
    return (
      typeof t == "object" &&
      t !== null &&
      t.constructor &&
      Object.prototype.toString.call(t).slice(8, -1) === "Object"
    );
  }
  function cp(t) {
    return typeof window != "undefined" &&
      typeof window.HTMLElement != "undefined"
      ? t instanceof HTMLElement
      : t && (t.nodeType === 1 || t.nodeType === 11);
  }
  function et() {
    const t = Object(arguments.length <= 0 ? void 0 : arguments[0]),
      e = ["__proto__", "constructor", "prototype"];
    for (let n = 1; n < arguments.length; n += 1) {
      const s = n < 0 || arguments.length <= n ? void 0 : arguments[n];
      if (s != null && !cp(s)) {
        const i = Object.keys(Object(s)).filter((r) => e.indexOf(r) < 0);
        for (let r = 0, o = i.length; r < o; r += 1) {
          const l = i[r],
            a = Object.getOwnPropertyDescriptor(s, l);
          a !== void 0 &&
            a.enumerable &&
            (Us(t[l]) && Us(s[l])
              ? s[l].__swiper__
                ? (t[l] = s[l])
                : et(t[l], s[l])
              : !Us(t[l]) && Us(s[l])
              ? ((t[l] = {}), s[l].__swiper__ ? (t[l] = s[l]) : et(t[l], s[l]))
              : (t[l] = s[l]));
        }
      }
    }
    return t;
  }
  function Ws(t, e, n) {
    t.style.setProperty(e, n);
  }
  function da(t) {
    let { swiper: e, targetPosition: n, side: s } = t;
    const i = qe(),
      r = -e.translate;
    let o = null,
      l;
    const a = e.params.speed;
    (e.wrapperEl.style.scrollSnapType = "none"),
      i.cancelAnimationFrame(e.cssModeFrameID);
    const u = n > r ? "next" : "prev",
      c = (f, p) => (u === "next" && f >= p) || (u === "prev" && f <= p),
      d = () => {
        (l = new Date().getTime()), o === null && (o = l);
        const f = Math.max(Math.min((l - o) / a, 1), 0),
          p = 0.5 - Math.cos(f * Math.PI) / 2;
        let h = r + p * (n - r);
        if ((c(h, n) && (h = n), e.wrapperEl.scrollTo({ [s]: h }), c(h, n))) {
          (e.wrapperEl.style.overflow = "hidden"),
            (e.wrapperEl.style.scrollSnapType = ""),
            setTimeout(() => {
              (e.wrapperEl.style.overflow = ""),
                e.wrapperEl.scrollTo({ [s]: h });
            }),
            i.cancelAnimationFrame(e.cssModeFrameID);
          return;
        }
        e.cssModeFrameID = i.requestAnimationFrame(d);
      };
    d();
  }
  function bt(t, e) {
    e === void 0 && (e = "");
    const n = qe(),
      s = [...t.children];
    return (
      n.HTMLSlotElement &&
        t instanceof HTMLSlotElement &&
        s.push(...t.assignedElements()),
      e ? s.filter((i) => i.matches(e)) : s
    );
  }
  function dp(t, e) {
    const n = [e];
    for (; n.length > 0; ) {
      const s = n.shift();
      if (t === s) return !0;
      n.push(
        ...s.children,
        ...(s.shadowRoot ? s.shadowRoot.children : []),
        ...(s.assignedElements ? s.assignedElements() : [])
      );
    }
  }
  function up(t, e) {
    const n = qe();
    let s = e.contains(t);
    return (
      !s &&
        n.HTMLSlotElement &&
        e instanceof HTMLSlotElement &&
        ((s = [...e.assignedElements()].includes(t)), s || (s = dp(t, e))),
      s
    );
  }
  function qs(t) {
    try {
      console.warn(t);
      return;
    } catch (e) {}
  }
  function ts(t, e) {
    e === void 0 && (e = []);
    const n = document.createElement(t);
    return n.classList.add(...(Array.isArray(e) ? e : rp(e))), n;
  }
  function fp(t, e) {
    const n = [];
    for (; t.previousElementSibling; ) {
      const s = t.previousElementSibling;
      e ? s.matches(e) && n.push(s) : n.push(s), (t = s);
    }
    return n;
  }
  function pp(t, e) {
    const n = [];
    for (; t.nextElementSibling; ) {
      const s = t.nextElementSibling;
      e ? s.matches(e) && n.push(s) : n.push(s), (t = s);
    }
    return n;
  }
  function Qt(t, e) {
    return qe().getComputedStyle(t, null).getPropertyValue(e);
  }
  function ns(t) {
    let e = t,
      n;
    if (e) {
      for (n = 0; (e = e.previousSibling) !== null; )
        e.nodeType === 1 && (n += 1);
      return n;
    }
  }
  function ua(t, e) {
    const n = [];
    let s = t.parentElement;
    for (; s; )
      e ? s.matches(e) && n.push(s) : n.push(s), (s = s.parentElement);
    return n;
  }
  function nr(t, e, n) {
    const s = qe();
    return (
      t[e === "width" ? "offsetWidth" : "offsetHeight"] +
      parseFloat(
        s
          .getComputedStyle(t, null)
          .getPropertyValue(e === "width" ? "margin-right" : "margin-top")
      ) +
      parseFloat(
        s
          .getComputedStyle(t, null)
          .getPropertyValue(e === "width" ? "margin-left" : "margin-bottom")
      )
    );
  }
  function ue(t) {
    return (Array.isArray(t) ? t : [t]).filter((e) => !!e);
  }
  function ss(t, e) {
    e === void 0 && (e = ""),
      typeof trustedTypes != "undefined"
        ? (t.innerHTML = trustedTypes
            .createPolicy("html", { createHTML: (n) => n })
            .createHTML(e))
        : (t.innerHTML = e);
  }
  let sr;
  function hp() {
    const t = qe(),
      e = ot();
    return {
      smoothScroll:
        e.documentElement &&
        e.documentElement.style &&
        "scrollBehavior" in e.documentElement.style,
      touch: !!(
        "ontouchstart" in t ||
        (t.DocumentTouch && e instanceof t.DocumentTouch)
      ),
    };
  }
  function fa() {
    return sr || (sr = hp()), sr;
  }
  let ir;
  function gp(t) {
    let { userAgent: e } = t === void 0 ? {} : t;
    const n = fa(),
      s = qe(),
      i = s.navigator.platform,
      r = e || s.navigator.userAgent,
      o = { ios: !1, android: !1 },
      l = s.screen.width,
      a = s.screen.height,
      u = r.match(/(Android);?[\s\/]+([\d.]+)?/);
    let c = r.match(/(iPad).*OS\s([\d_]+)/);
    const d = r.match(/(iPod)(.*OS\s([\d_]+))?/),
      f = !c && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
      p = i === "Win32";
    let h = i === "MacIntel";
    const m = [
      "1024x1366",
      "1366x1024",
      "834x1194",
      "1194x834",
      "834x1112",
      "1112x834",
      "768x1024",
      "1024x768",
      "820x1180",
      "1180x820",
      "810x1080",
      "1080x810",
    ];
    return (
      !c &&
        h &&
        n.touch &&
        m.indexOf(`${l}x${a}`) >= 0 &&
        ((c = r.match(/(Version)\/([\d.]+)/)),
        c || (c = [0, 1, "13_0_0"]),
        (h = !1)),
      u && !p && ((o.os = "android"), (o.android = !0)),
      (c || f || d) && ((o.os = "ios"), (o.ios = !0)),
      o
    );
  }
  function pa(t) {
    return t === void 0 && (t = {}), ir || (ir = gp(t)), ir;
  }
  let rr;
  function mp() {
    const t = qe(),
      e = pa();
    let n = !1;
    function s() {
      const l = t.navigator.userAgent.toLowerCase();
      return (
        l.indexOf("safari") >= 0 &&
        l.indexOf("chrome") < 0 &&
        l.indexOf("android") < 0
      );
    }
    if (s()) {
      const l = String(t.navigator.userAgent);
      if (l.includes("Version/")) {
        const [a, u] = l
          .split("Version/")[1]
          .split(" ")[0]
          .split(".")
          .map((c) => Number(c));
        n = a < 16 || (a === 16 && u < 2);
      }
    }
    const i = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
        t.navigator.userAgent
      ),
      r = s(),
      o = r || (i && e.ios);
    return {
      isSafari: n || r,
      needPerspectiveFix: n,
      need3dFix: o,
      isWebView: i,
    };
  }
  function ha() {
    return rr || (rr = mp()), rr;
  }
  function vp(t) {
    let { swiper: e, on: n, emit: s } = t;
    const i = qe();
    let r = null,
      o = null;
    const l = () => {
        !e || e.destroyed || !e.initialized || (s("beforeResize"), s("resize"));
      },
      a = () => {
        !e ||
          e.destroyed ||
          !e.initialized ||
          ((r = new ResizeObserver((d) => {
            o = i.requestAnimationFrame(() => {
              const { width: f, height: p } = e;
              let h = f,
                m = p;
              d.forEach((b) => {
                let { contentBoxSize: w, contentRect: g, target: y } = b;
                (y && y !== e.el) ||
                  ((h = g ? g.width : (w[0] || w).inlineSize),
                  (m = g ? g.height : (w[0] || w).blockSize));
              }),
                (h !== f || m !== p) && l();
            });
          })),
          r.observe(e.el));
      },
      u = () => {
        o && i.cancelAnimationFrame(o),
          r && r.unobserve && e.el && (r.unobserve(e.el), (r = null));
      },
      c = () => {
        !e || e.destroyed || !e.initialized || s("orientationchange");
      };
    n("init", () => {
      if (e.params.resizeObserver && typeof i.ResizeObserver != "undefined") {
        a();
        return;
      }
      i.addEventListener("resize", l),
        i.addEventListener("orientationchange", c);
    }),
      n("destroy", () => {
        u(),
          i.removeEventListener("resize", l),
          i.removeEventListener("orientationchange", c);
      });
  }
  function yp(t) {
    let { swiper: e, extendParams: n, on: s, emit: i } = t;
    const r = [],
      o = qe(),
      l = function (c, d) {
        d === void 0 && (d = {});
        const f = o.MutationObserver || o.WebkitMutationObserver,
          p = new f((h) => {
            if (e.__preventObserver__) return;
            if (h.length === 1) {
              i("observerUpdate", h[0]);
              return;
            }
            const m = function () {
              i("observerUpdate", h[0]);
            };
            o.requestAnimationFrame
              ? o.requestAnimationFrame(m)
              : o.setTimeout(m, 0);
          });
        p.observe(c, {
          attributes: typeof d.attributes == "undefined" ? !0 : d.attributes,
          childList:
            e.isElement ||
            (typeof d.childList == "undefined" ? !0 : d).childList,
          characterData:
            typeof d.characterData == "undefined" ? !0 : d.characterData,
        }),
          r.push(p);
      },
      a = () => {
        if (e.params.observer) {
          if (e.params.observeParents) {
            const c = ua(e.hostEl);
            for (let d = 0; d < c.length; d += 1) l(c[d]);
          }
          l(e.hostEl, { childList: e.params.observeSlideChildren }),
            l(e.wrapperEl, { attributes: !1 });
        }
      },
      u = () => {
        r.forEach((c) => {
          c.disconnect();
        }),
          r.splice(0, r.length);
      };
    n({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
      s("init", a),
      s("destroy", u);
  }
  var bp = {
    on(t, e, n) {
      const s = this;
      if (!s.eventsListeners || s.destroyed || typeof e != "function") return s;
      const i = n ? "unshift" : "push";
      return (
        t.split(" ").forEach((r) => {
          s.eventsListeners[r] || (s.eventsListeners[r] = []),
            s.eventsListeners[r][i](e);
        }),
        s
      );
    },
    once(t, e, n) {
      const s = this;
      if (!s.eventsListeners || s.destroyed || typeof e != "function") return s;
      function i() {
        s.off(t, i), i.__emitterProxy && delete i.__emitterProxy;
        for (var r = arguments.length, o = new Array(r), l = 0; l < r; l++)
          o[l] = arguments[l];
        e.apply(s, o);
      }
      return (i.__emitterProxy = e), s.on(t, i, n);
    },
    onAny(t, e) {
      const n = this;
      if (!n.eventsListeners || n.destroyed || typeof t != "function") return n;
      const s = e ? "unshift" : "push";
      return (
        n.eventsAnyListeners.indexOf(t) < 0 && n.eventsAnyListeners[s](t), n
      );
    },
    offAny(t) {
      const e = this;
      if (!e.eventsListeners || e.destroyed || !e.eventsAnyListeners) return e;
      const n = e.eventsAnyListeners.indexOf(t);
      return n >= 0 && e.eventsAnyListeners.splice(n, 1), e;
    },
    off(t, e) {
      const n = this;
      return (
        !n.eventsListeners ||
          n.destroyed ||
          !n.eventsListeners ||
          t.split(" ").forEach((s) => {
            typeof e == "undefined"
              ? (n.eventsListeners[s] = [])
              : n.eventsListeners[s] &&
                n.eventsListeners[s].forEach((i, r) => {
                  (i === e || (i.__emitterProxy && i.__emitterProxy === e)) &&
                    n.eventsListeners[s].splice(r, 1);
                });
          }),
        n
      );
    },
    emit() {
      const t = this;
      if (!t.eventsListeners || t.destroyed || !t.eventsListeners) return t;
      let e, n, s;
      for (var i = arguments.length, r = new Array(i), o = 0; o < i; o++)
        r[o] = arguments[o];
      return (
        typeof r[0] == "string" || Array.isArray(r[0])
          ? ((e = r[0]), (n = r.slice(1, r.length)), (s = t))
          : ((e = r[0].events), (n = r[0].data), (s = r[0].context || t)),
        n.unshift(s),
        (Array.isArray(e) ? e : e.split(" ")).forEach((a) => {
          t.eventsAnyListeners &&
            t.eventsAnyListeners.length &&
            t.eventsAnyListeners.forEach((u) => {
              u.apply(s, [a, ...n]);
            }),
            t.eventsListeners &&
              t.eventsListeners[a] &&
              t.eventsListeners[a].forEach((u) => {
                u.apply(s, n);
              });
        }),
        t
      );
    },
  };
  function wp() {
    const t = this;
    let e, n;
    const s = t.el;
    typeof t.params.width != "undefined" && t.params.width !== null
      ? (e = t.params.width)
      : (e = s.clientWidth),
      typeof t.params.height != "undefined" && t.params.height !== null
        ? (n = t.params.height)
        : (n = s.clientHeight),
      !((e === 0 && t.isHorizontal()) || (n === 0 && t.isVertical())) &&
        ((e =
          e -
          parseInt(Qt(s, "padding-left") || 0, 10) -
          parseInt(Qt(s, "padding-right") || 0, 10)),
        (n =
          n -
          parseInt(Qt(s, "padding-top") || 0, 10) -
          parseInt(Qt(s, "padding-bottom") || 0, 10)),
        Number.isNaN(e) && (e = 0),
        Number.isNaN(n) && (n = 0),
        Object.assign(t, {
          width: e,
          height: n,
          size: t.isHorizontal() ? e : n,
        }));
  }
  function _p() {
    const t = this;
    function e(P, $) {
      return parseFloat(P.getPropertyValue(t.getDirectionLabel($)) || 0);
    }
    const n = t.params,
      { wrapperEl: s, slidesEl: i, size: r, rtlTranslate: o, wrongRTL: l } = t,
      a = t.virtual && n.virtual.enabled,
      u = a ? t.virtual.slides.length : t.slides.length,
      c = bt(i, `.${t.params.slideClass}, swiper-slide`),
      d = a ? t.virtual.slides.length : c.length;
    let f = [];
    const p = [],
      h = [];
    let m = n.slidesOffsetBefore;
    typeof m == "function" && (m = n.slidesOffsetBefore.call(t));
    let b = n.slidesOffsetAfter;
    typeof b == "function" && (b = n.slidesOffsetAfter.call(t));
    const w = t.snapGrid.length,
      g = t.slidesGrid.length;
    let y = n.spaceBetween,
      E = -m,
      C = 0,
      O = 0;
    if (typeof r == "undefined") return;
    typeof y == "string" && y.indexOf("%") >= 0
      ? (y = (parseFloat(y.replace("%", "")) / 100) * r)
      : typeof y == "string" && (y = parseFloat(y)),
      (t.virtualSize = -y),
      c.forEach((P) => {
        o ? (P.style.marginLeft = "") : (P.style.marginRight = ""),
          (P.style.marginBottom = ""),
          (P.style.marginTop = "");
      }),
      n.centeredSlides &&
        n.cssMode &&
        (Ws(s, "--swiper-centered-offset-before", ""),
        Ws(s, "--swiper-centered-offset-after", ""));
    const z = n.grid && n.grid.rows > 1 && t.grid;
    z ? t.grid.initSlides(c) : t.grid && t.grid.unsetSlides();
    let N;
    const T =
      n.slidesPerView === "auto" &&
      n.breakpoints &&
      Object.keys(n.breakpoints).filter(
        (P) => typeof n.breakpoints[P].slidesPerView != "undefined"
      ).length > 0;
    for (let P = 0; P < d; P += 1) {
      N = 0;
      let $;
      if (
        (c[P] && ($ = c[P]),
        z && t.grid.updateSlide(P, $, c),
        !(c[P] && Qt($, "display") === "none"))
      ) {
        if (n.slidesPerView === "auto") {
          T && (c[P].style[t.getDirectionLabel("width")] = "");
          const R = getComputedStyle($),
            G = $.style.transform,
            ee = $.style.webkitTransform;
          if (
            (G && ($.style.transform = "none"),
            ee && ($.style.webkitTransform = "none"),
            n.roundLengths)
          )
            N = t.isHorizontal() ? nr($, "width") : nr($, "height");
          else {
            const re = e(R, "width"),
              W = e(R, "padding-left"),
              A = e(R, "padding-right"),
              M = e(R, "margin-left"),
              Y = e(R, "margin-right"),
              le = R.getPropertyValue("box-sizing");
            if (le && le === "border-box") N = re + M + Y;
            else {
              const { clientWidth: Ce, offsetWidth: Ee } = $;
              N = re + W + A + M + Y + (Ee - Ce);
            }
          }
          G && ($.style.transform = G),
            ee && ($.style.webkitTransform = ee),
            n.roundLengths && (N = Math.floor(N));
        } else
          (N = (r - (n.slidesPerView - 1) * y) / n.slidesPerView),
            n.roundLengths && (N = Math.floor(N)),
            c[P] && (c[P].style[t.getDirectionLabel("width")] = `${N}px`);
        c[P] && (c[P].swiperSlideSize = N),
          h.push(N),
          n.centeredSlides
            ? ((E = E + N / 2 + C / 2 + y),
              C === 0 && P !== 0 && (E = E - r / 2 - y),
              P === 0 && (E = E - r / 2 - y),
              Math.abs(E) < 1 / 1e3 && (E = 0),
              n.roundLengths && (E = Math.floor(E)),
              O % n.slidesPerGroup === 0 && f.push(E),
              p.push(E))
            : (n.roundLengths && (E = Math.floor(E)),
              (O - Math.min(t.params.slidesPerGroupSkip, O)) %
                t.params.slidesPerGroup ===
                0 && f.push(E),
              p.push(E),
              (E = E + N + y)),
          (t.virtualSize += N + y),
          (C = N),
          (O += 1);
      }
    }
    if (
      ((t.virtualSize = Math.max(t.virtualSize, r) + b),
      o &&
        l &&
        (n.effect === "slide" || n.effect === "coverflow") &&
        (s.style.width = `${t.virtualSize + y}px`),
      n.setWrapperSize &&
        (s.style[t.getDirectionLabel("width")] = `${t.virtualSize + y}px`),
      z && t.grid.updateWrapperSize(N, f),
      !n.centeredSlides)
    ) {
      const P = [];
      for (let $ = 0; $ < f.length; $ += 1) {
        let R = f[$];
        n.roundLengths && (R = Math.floor(R)),
          f[$] <= t.virtualSize - r && P.push(R);
      }
      (f = P),
        Math.floor(t.virtualSize - r) - Math.floor(f[f.length - 1]) > 1 &&
          f.push(t.virtualSize - r);
    }
    if (a && n.loop) {
      const P = h[0] + y;
      if (n.slidesPerGroup > 1) {
        const $ = Math.ceil(
            (t.virtual.slidesBefore + t.virtual.slidesAfter) / n.slidesPerGroup
          ),
          R = P * n.slidesPerGroup;
        for (let G = 0; G < $; G += 1) f.push(f[f.length - 1] + R);
      }
      for (
        let $ = 0;
        $ < t.virtual.slidesBefore + t.virtual.slidesAfter;
        $ += 1
      )
        n.slidesPerGroup === 1 && f.push(f[f.length - 1] + P),
          p.push(p[p.length - 1] + P),
          (t.virtualSize += P);
    }
    if ((f.length === 0 && (f = [0]), y !== 0)) {
      const P =
        t.isHorizontal() && o
          ? "marginLeft"
          : t.getDirectionLabel("marginRight");
      c.filter(($, R) =>
        !n.cssMode || n.loop ? !0 : R !== c.length - 1
      ).forEach(($) => {
        $.style[P] = `${y}px`;
      });
    }
    if (n.centeredSlides && n.centeredSlidesBounds) {
      let P = 0;
      h.forEach((R) => {
        P += R + (y || 0);
      }),
        (P -= y);
      const $ = P > r ? P - r : 0;
      f = f.map((R) => (R <= 0 ? -m : R > $ ? $ + b : R));
    }
    if (n.centerInsufficientSlides) {
      let P = 0;
      h.forEach((R) => {
        P += R + (y || 0);
      }),
        (P -= y);
      const $ = (n.slidesOffsetBefore || 0) + (n.slidesOffsetAfter || 0);
      if (P + $ < r) {
        const R = (r - P - $) / 2;
        f.forEach((G, ee) => {
          f[ee] = G - R;
        }),
          p.forEach((G, ee) => {
            p[ee] = G + R;
          });
      }
    }
    if (
      (Object.assign(t, {
        slides: c,
        snapGrid: f,
        slidesGrid: p,
        slidesSizesGrid: h,
      }),
      n.centeredSlides && n.cssMode && !n.centeredSlidesBounds)
    ) {
      Ws(s, "--swiper-centered-offset-before", `${-f[0]}px`),
        Ws(
          s,
          "--swiper-centered-offset-after",
          `${t.size / 2 - h[h.length - 1] / 2}px`
        );
      const P = -t.snapGrid[0],
        $ = -t.slidesGrid[0];
      (t.snapGrid = t.snapGrid.map((R) => R + P)),
        (t.slidesGrid = t.slidesGrid.map((R) => R + $));
    }
    if (
      (d !== u && t.emit("slidesLengthChange"),
      f.length !== w &&
        (t.params.watchOverflow && t.checkOverflow(),
        t.emit("snapGridLengthChange")),
      p.length !== g && t.emit("slidesGridLengthChange"),
      n.watchSlidesProgress && t.updateSlidesOffset(),
      t.emit("slidesUpdated"),
      !a && !n.cssMode && (n.effect === "slide" || n.effect === "fade"))
    ) {
      const P = `${n.containerModifierClass}backface-hidden`,
        $ = t.el.classList.contains(P);
      d <= n.maxBackfaceHiddenSlides
        ? $ || t.el.classList.add(P)
        : $ && t.el.classList.remove(P);
    }
  }
  function Sp(t) {
    const e = this,
      n = [],
      s = e.virtual && e.params.virtual.enabled;
    let i = 0,
      r;
    typeof t == "number"
      ? e.setTransition(t)
      : t === !0 && e.setTransition(e.params.speed);
    const o = (l) => (s ? e.slides[e.getSlideIndexByData(l)] : e.slides[l]);
    if (e.params.slidesPerView !== "auto" && e.params.slidesPerView > 1)
      if (e.params.centeredSlides)
        (e.visibleSlides || []).forEach((l) => {
          n.push(l);
        });
      else
        for (r = 0; r < Math.ceil(e.params.slidesPerView); r += 1) {
          const l = e.activeIndex + r;
          if (l > e.slides.length && !s) break;
          n.push(o(l));
        }
    else n.push(o(e.activeIndex));
    for (r = 0; r < n.length; r += 1)
      if (typeof n[r] != "undefined") {
        const l = n[r].offsetHeight;
        i = l > i ? l : i;
      }
    (i || i === 0) && (e.wrapperEl.style.height = `${i}px`);
  }
  function Ep() {
    const t = this,
      e = t.slides,
      n = t.isElement
        ? t.isHorizontal()
          ? t.wrapperEl.offsetLeft
          : t.wrapperEl.offsetTop
        : 0;
    for (let s = 0; s < e.length; s += 1)
      e[s].swiperSlideOffset =
        (t.isHorizontal() ? e[s].offsetLeft : e[s].offsetTop) -
        n -
        t.cssOverflowAdjustment();
  }
  const ga = (t, e, n) => {
    e && !t.classList.contains(n)
      ? t.classList.add(n)
      : !e && t.classList.contains(n) && t.classList.remove(n);
  };
  function xp(t) {
    t === void 0 && (t = (this && this.translate) || 0);
    const e = this,
      n = e.params,
      { slides: s, rtlTranslate: i, snapGrid: r } = e;
    if (s.length === 0) return;
    typeof s[0].swiperSlideOffset == "undefined" && e.updateSlidesOffset();
    let o = -t;
    i && (o = t), (e.visibleSlidesIndexes = []), (e.visibleSlides = []);
    let l = n.spaceBetween;
    typeof l == "string" && l.indexOf("%") >= 0
      ? (l = (parseFloat(l.replace("%", "")) / 100) * e.size)
      : typeof l == "string" && (l = parseFloat(l));
    for (let a = 0; a < s.length; a += 1) {
      const u = s[a];
      let c = u.swiperSlideOffset;
      n.cssMode && n.centeredSlides && (c -= s[0].swiperSlideOffset);
      const d =
          (o + (n.centeredSlides ? e.minTranslate() : 0) - c) /
          (u.swiperSlideSize + l),
        f =
          (o - r[0] + (n.centeredSlides ? e.minTranslate() : 0) - c) /
          (u.swiperSlideSize + l),
        p = -(o - c),
        h = p + e.slidesSizesGrid[a],
        m = p >= 0 && p <= e.size - e.slidesSizesGrid[a],
        b =
          (p >= 0 && p < e.size - 1) ||
          (h > 1 && h <= e.size) ||
          (p <= 0 && h >= e.size);
      b && (e.visibleSlides.push(u), e.visibleSlidesIndexes.push(a)),
        ga(u, b, n.slideVisibleClass),
        ga(u, m, n.slideFullyVisibleClass),
        (u.progress = i ? -d : d),
        (u.originalProgress = i ? -f : f);
    }
  }
  function Tp(t) {
    const e = this;
    if (typeof t == "undefined") {
      const c = e.rtlTranslate ? -1 : 1;
      t = (e && e.translate && e.translate * c) || 0;
    }
    const n = e.params,
      s = e.maxTranslate() - e.minTranslate();
    let { progress: i, isBeginning: r, isEnd: o, progressLoop: l } = e;
    const a = r,
      u = o;
    if (s === 0) (i = 0), (r = !0), (o = !0);
    else {
      i = (t - e.minTranslate()) / s;
      const c = Math.abs(t - e.minTranslate()) < 1,
        d = Math.abs(t - e.maxTranslate()) < 1;
      (r = c || i <= 0), (o = d || i >= 1), c && (i = 0), d && (i = 1);
    }
    if (n.loop) {
      const c = e.getSlideIndexByData(0),
        d = e.getSlideIndexByData(e.slides.length - 1),
        f = e.slidesGrid[c],
        p = e.slidesGrid[d],
        h = e.slidesGrid[e.slidesGrid.length - 1],
        m = Math.abs(t);
      m >= f ? (l = (m - f) / h) : (l = (m + h - p) / h), l > 1 && (l -= 1);
    }
    Object.assign(e, {
      progress: i,
      progressLoop: l,
      isBeginning: r,
      isEnd: o,
    }),
      (n.watchSlidesProgress || (n.centeredSlides && n.autoHeight)) &&
        e.updateSlidesProgress(t),
      r && !a && e.emit("reachBeginning toEdge"),
      o && !u && e.emit("reachEnd toEdge"),
      ((a && !r) || (u && !o)) && e.emit("fromEdge"),
      e.emit("progress", i);
  }
  const or = (t, e, n) => {
    e && !t.classList.contains(n)
      ? t.classList.add(n)
      : !e && t.classList.contains(n) && t.classList.remove(n);
  };
  function Cp() {
    const t = this,
      { slides: e, params: n, slidesEl: s, activeIndex: i } = t,
      r = t.virtual && n.virtual.enabled,
      o = t.grid && n.grid && n.grid.rows > 1,
      l = (d) => bt(s, `.${n.slideClass}${d}, swiper-slide${d}`)[0];
    let a, u, c;
    if (r)
      if (n.loop) {
        let d = i - t.virtual.slidesBefore;
        d < 0 && (d = t.virtual.slides.length + d),
          d >= t.virtual.slides.length && (d -= t.virtual.slides.length),
          (a = l(`[data-swiper-slide-index="${d}"]`));
      } else a = l(`[data-swiper-slide-index="${i}"]`);
    else
      o
        ? ((a = e.find((d) => d.column === i)),
          (c = e.find((d) => d.column === i + 1)),
          (u = e.find((d) => d.column === i - 1)))
        : (a = e[i]);
    a &&
      (o ||
        ((c = pp(a, `.${n.slideClass}, swiper-slide`)[0]),
        n.loop && !c && (c = e[0]),
        (u = fp(a, `.${n.slideClass}, swiper-slide`)[0]),
        n.loop && !u === 0 && (u = e[e.length - 1]))),
      e.forEach((d) => {
        or(d, d === a, n.slideActiveClass),
          or(d, d === c, n.slideNextClass),
          or(d, d === u, n.slidePrevClass);
      }),
      t.emitSlidesClasses();
  }
  const Ks = (t, e) => {
      if (!t || t.destroyed || !t.params) return;
      const n = () =>
          t.isElement ? "swiper-slide" : `.${t.params.slideClass}`,
        s = e.closest(n());
      if (s) {
        let i = s.querySelector(`.${t.params.lazyPreloaderClass}`);
        !i &&
          t.isElement &&
          (s.shadowRoot
            ? (i = s.shadowRoot.querySelector(
                `.${t.params.lazyPreloaderClass}`
              ))
            : requestAnimationFrame(() => {
                s.shadowRoot &&
                  ((i = s.shadowRoot.querySelector(
                    `.${t.params.lazyPreloaderClass}`
                  )),
                  i && i.remove());
              })),
          i && i.remove();
      }
    },
    lr = (t, e) => {
      if (!t.slides[e]) return;
      const n = t.slides[e].querySelector('[loading="lazy"]');
      n && n.removeAttribute("loading");
    },
    ar = (t) => {
      if (!t || t.destroyed || !t.params) return;
      let e = t.params.lazyPreloadPrevNext;
      const n = t.slides.length;
      if (!n || !e || e < 0) return;
      e = Math.min(e, n);
      const s =
          t.params.slidesPerView === "auto"
            ? t.slidesPerViewDynamic()
            : Math.ceil(t.params.slidesPerView),
        i = t.activeIndex;
      if (t.params.grid && t.params.grid.rows > 1) {
        const o = i,
          l = [o - e];
        l.push(...Array.from({ length: e }).map((a, u) => o + s + u)),
          t.slides.forEach((a, u) => {
            l.includes(a.column) && lr(t, u);
          });
        return;
      }
      const r = i + s - 1;
      if (t.params.rewind || t.params.loop)
        for (let o = i - e; o <= r + e; o += 1) {
          const l = ((o % n) + n) % n;
          (l < i || l > r) && lr(t, l);
        }
      else
        for (let o = Math.max(i - e, 0); o <= Math.min(r + e, n - 1); o += 1)
          o !== i && (o > r || o < i) && lr(t, o);
    };
  function Ap(t) {
    const { slidesGrid: e, params: n } = t,
      s = t.rtlTranslate ? t.translate : -t.translate;
    let i;
    for (let r = 0; r < e.length; r += 1)
      typeof e[r + 1] != "undefined"
        ? s >= e[r] && s < e[r + 1] - (e[r + 1] - e[r]) / 2
          ? (i = r)
          : s >= e[r] && s < e[r + 1] && (i = r + 1)
        : s >= e[r] && (i = r);
    return (
      n.normalizeSlideIndex && (i < 0 || typeof i == "undefined") && (i = 0), i
    );
  }
  function Mp(t) {
    const e = this,
      n = e.rtlTranslate ? e.translate : -e.translate,
      {
        snapGrid: s,
        params: i,
        activeIndex: r,
        realIndex: o,
        snapIndex: l,
      } = e;
    let a = t,
      u;
    const c = (p) => {
      let h = p - e.virtual.slidesBefore;
      return (
        h < 0 && (h = e.virtual.slides.length + h),
        h >= e.virtual.slides.length && (h -= e.virtual.slides.length),
        h
      );
    };
    if ((typeof a == "undefined" && (a = Ap(e)), s.indexOf(n) >= 0))
      u = s.indexOf(n);
    else {
      const p = Math.min(i.slidesPerGroupSkip, a);
      u = p + Math.floor((a - p) / i.slidesPerGroup);
    }
    if ((u >= s.length && (u = s.length - 1), a === r && !e.params.loop)) {
      u !== l && ((e.snapIndex = u), e.emit("snapIndexChange"));
      return;
    }
    if (a === r && e.params.loop && e.virtual && e.params.virtual.enabled) {
      e.realIndex = c(a);
      return;
    }
    const d = e.grid && i.grid && i.grid.rows > 1;
    let f;
    if (e.virtual && i.virtual.enabled && i.loop) f = c(a);
    else if (d) {
      const p = e.slides.find((m) => m.column === a);
      let h = parseInt(p.getAttribute("data-swiper-slide-index"), 10);
      Number.isNaN(h) && (h = Math.max(e.slides.indexOf(p), 0)),
        (f = Math.floor(h / i.grid.rows));
    } else if (e.slides[a]) {
      const p = e.slides[a].getAttribute("data-swiper-slide-index");
      p ? (f = parseInt(p, 10)) : (f = a);
    } else f = a;
    Object.assign(e, {
      previousSnapIndex: l,
      snapIndex: u,
      previousRealIndex: o,
      realIndex: f,
      previousIndex: r,
      activeIndex: a,
    }),
      e.initialized && ar(e),
      e.emit("activeIndexChange"),
      e.emit("snapIndexChange"),
      (e.initialized || e.params.runCallbacksOnInit) &&
        (o !== f && e.emit("realIndexChange"), e.emit("slideChange"));
  }
  function Pp(t, e) {
    const n = this,
      s = n.params;
    let i = t.closest(`.${s.slideClass}, swiper-slide`);
    !i &&
      n.isElement &&
      e &&
      e.length > 1 &&
      e.includes(t) &&
      [...e.slice(e.indexOf(t) + 1, e.length)].forEach((l) => {
        !i &&
          l.matches &&
          l.matches(`.${s.slideClass}, swiper-slide`) &&
          (i = l);
      });
    let r = !1,
      o;
    if (i) {
      for (let l = 0; l < n.slides.length; l += 1)
        if (n.slides[l] === i) {
          (r = !0), (o = l);
          break;
        }
    }
    if (i && r)
      (n.clickedSlide = i),
        n.virtual && n.params.virtual.enabled
          ? (n.clickedIndex = parseInt(
              i.getAttribute("data-swiper-slide-index"),
              10
            ))
          : (n.clickedIndex = o);
    else {
      (n.clickedSlide = void 0), (n.clickedIndex = void 0);
      return;
    }
    s.slideToClickedSlide &&
      n.clickedIndex !== void 0 &&
      n.clickedIndex !== n.activeIndex &&
      n.slideToClickedSlide();
  }
  var Lp = {
    updateSize: wp,
    updateSlides: _p,
    updateAutoHeight: Sp,
    updateSlidesOffset: Ep,
    updateSlidesProgress: xp,
    updateProgress: Tp,
    updateSlidesClasses: Cp,
    updateActiveIndex: Mp,
    updateClickedSlide: Pp,
  };
  function Ip(t) {
    t === void 0 && (t = this.isHorizontal() ? "x" : "y");
    const e = this,
      { params: n, rtlTranslate: s, translate: i, wrapperEl: r } = e;
    if (n.virtualTranslate) return s ? -i : i;
    if (n.cssMode) return i;
    let o = ap(r, t);
    return (o += e.cssOverflowAdjustment()), s && (o = -o), o || 0;
  }
  function Op(t, e) {
    const n = this,
      { rtlTranslate: s, params: i, wrapperEl: r, progress: o } = n;
    let l = 0,
      a = 0;
    const u = 0;
    n.isHorizontal() ? (l = s ? -t : t) : (a = t),
      i.roundLengths && ((l = Math.floor(l)), (a = Math.floor(a))),
      (n.previousTranslate = n.translate),
      (n.translate = n.isHorizontal() ? l : a),
      i.cssMode
        ? (r[n.isHorizontal() ? "scrollLeft" : "scrollTop"] = n.isHorizontal()
            ? -l
            : -a)
        : i.virtualTranslate ||
          (n.isHorizontal()
            ? (l -= n.cssOverflowAdjustment())
            : (a -= n.cssOverflowAdjustment()),
          (r.style.transform = `translate3d(${l}px, ${a}px, ${u}px)`));
    let c;
    const d = n.maxTranslate() - n.minTranslate();
    d === 0 ? (c = 0) : (c = (t - n.minTranslate()) / d),
      c !== o && n.updateProgress(t),
      n.emit("setTranslate", n.translate, e);
  }
  function kp() {
    return -this.snapGrid[0];
  }
  function Rp() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }
  function Bp(t, e, n, s, i) {
    t === void 0 && (t = 0),
      e === void 0 && (e = this.params.speed),
      n === void 0 && (n = !0),
      s === void 0 && (s = !0);
    const r = this,
      { params: o, wrapperEl: l } = r;
    if (r.animating && o.preventInteractionOnTransition) return !1;
    const a = r.minTranslate(),
      u = r.maxTranslate();
    let c;
    if (
      (s && t > a ? (c = a) : s && t < u ? (c = u) : (c = t),
      r.updateProgress(c),
      o.cssMode)
    ) {
      const d = r.isHorizontal();
      if (e === 0) l[d ? "scrollLeft" : "scrollTop"] = -c;
      else {
        if (!r.support.smoothScroll)
          return (
            da({ swiper: r, targetPosition: -c, side: d ? "left" : "top" }), !0
          );
        l.scrollTo({ [d ? "left" : "top"]: -c, behavior: "smooth" });
      }
      return !0;
    }
    return (
      e === 0
        ? (r.setTransition(0),
          r.setTranslate(c),
          n && (r.emit("beforeTransitionStart", e, i), r.emit("transitionEnd")))
        : (r.setTransition(e),
          r.setTranslate(c),
          n &&
            (r.emit("beforeTransitionStart", e, i), r.emit("transitionStart")),
          r.animating ||
            ((r.animating = !0),
            r.onTranslateToWrapperTransitionEnd ||
              (r.onTranslateToWrapperTransitionEnd = function (f) {
                !r ||
                  r.destroyed ||
                  (f.target === this &&
                    (r.wrapperEl.removeEventListener(
                      "transitionend",
                      r.onTranslateToWrapperTransitionEnd
                    ),
                    (r.onTranslateToWrapperTransitionEnd = null),
                    delete r.onTranslateToWrapperTransitionEnd,
                    (r.animating = !1),
                    n && r.emit("transitionEnd")));
              }),
            r.wrapperEl.addEventListener(
              "transitionend",
              r.onTranslateToWrapperTransitionEnd
            ))),
      !0
    );
  }
  var $p = {
    getTranslate: Ip,
    setTranslate: Op,
    minTranslate: kp,
    maxTranslate: Rp,
    translateTo: Bp,
  };
  function zp(t, e) {
    const n = this;
    n.params.cssMode ||
      ((n.wrapperEl.style.transitionDuration = `${t}ms`),
      (n.wrapperEl.style.transitionDelay = t === 0 ? "0ms" : "")),
      n.emit("setTransition", t, e);
  }
  function ma(t) {
    let { swiper: e, runCallbacks: n, direction: s, step: i } = t;
    const { activeIndex: r, previousIndex: o } = e;
    let l = s;
    l || (r > o ? (l = "next") : r < o ? (l = "prev") : (l = "reset")),
      e.emit(`transition${i}`),
      n && l === "reset"
        ? e.emit(`slideResetTransition${i}`)
        : n &&
          r !== o &&
          (e.emit(`slideChangeTransition${i}`),
          l === "next"
            ? e.emit(`slideNextTransition${i}`)
            : e.emit(`slidePrevTransition${i}`));
  }
  function Np(t, e) {
    t === void 0 && (t = !0);
    const n = this,
      { params: s } = n;
    s.cssMode ||
      (s.autoHeight && n.updateAutoHeight(),
      ma({ swiper: n, runCallbacks: t, direction: e, step: "Start" }));
  }
  function Hp(t, e) {
    t === void 0 && (t = !0);
    const n = this,
      { params: s } = n;
    (n.animating = !1),
      !s.cssMode &&
        (n.setTransition(0),
        ma({ swiper: n, runCallbacks: t, direction: e, step: "End" }));
  }
  var Fp = { setTransition: zp, transitionStart: Np, transitionEnd: Hp };
  function Dp(t, e, n, s, i) {
    t === void 0 && (t = 0),
      n === void 0 && (n = !0),
      typeof t == "string" && (t = parseInt(t, 10));
    const r = this;
    let o = t;
    o < 0 && (o = 0);
    const {
      params: l,
      snapGrid: a,
      slidesGrid: u,
      previousIndex: c,
      activeIndex: d,
      rtlTranslate: f,
      wrapperEl: p,
      enabled: h,
    } = r;
    if (
      (!h && !s && !i) ||
      r.destroyed ||
      (r.animating && l.preventInteractionOnTransition)
    )
      return !1;
    typeof e == "undefined" && (e = r.params.speed);
    const m = Math.min(r.params.slidesPerGroupSkip, o);
    let b = m + Math.floor((o - m) / r.params.slidesPerGroup);
    b >= a.length && (b = a.length - 1);
    const w = -a[b];
    if (l.normalizeSlideIndex)
      for (let z = 0; z < u.length; z += 1) {
        const N = -Math.floor(w * 100),
          T = Math.floor(u[z] * 100),
          P = Math.floor(u[z + 1] * 100);
        typeof u[z + 1] != "undefined"
          ? N >= T && N < P - (P - T) / 2
            ? (o = z)
            : N >= T && N < P && (o = z + 1)
          : N >= T && (o = z);
      }
    if (
      r.initialized &&
      o !== d &&
      ((!r.allowSlideNext &&
        (f
          ? w > r.translate && w > r.minTranslate()
          : w < r.translate && w < r.minTranslate())) ||
        (!r.allowSlidePrev &&
          w > r.translate &&
          w > r.maxTranslate() &&
          (d || 0) !== o))
    )
      return !1;
    o !== (c || 0) && n && r.emit("beforeSlideChangeStart"),
      r.updateProgress(w);
    let g;
    o > d ? (g = "next") : o < d ? (g = "prev") : (g = "reset");
    const y = r.virtual && r.params.virtual.enabled;
    if (!(y && i) && ((f && -w === r.translate) || (!f && w === r.translate)))
      return (
        r.updateActiveIndex(o),
        l.autoHeight && r.updateAutoHeight(),
        r.updateSlidesClasses(),
        l.effect !== "slide" && r.setTranslate(w),
        g !== "reset" && (r.transitionStart(n, g), r.transitionEnd(n, g)),
        !1
      );
    if (l.cssMode) {
      const z = r.isHorizontal(),
        N = f ? w : -w;
      if (e === 0)
        y &&
          ((r.wrapperEl.style.scrollSnapType = "none"),
          (r._immediateVirtual = !0)),
          y && !r._cssModeVirtualInitialSet && r.params.initialSlide > 0
            ? ((r._cssModeVirtualInitialSet = !0),
              requestAnimationFrame(() => {
                p[z ? "scrollLeft" : "scrollTop"] = N;
              }))
            : (p[z ? "scrollLeft" : "scrollTop"] = N),
          y &&
            requestAnimationFrame(() => {
              (r.wrapperEl.style.scrollSnapType = ""),
                (r._immediateVirtual = !1);
            });
      else {
        if (!r.support.smoothScroll)
          return (
            da({ swiper: r, targetPosition: N, side: z ? "left" : "top" }), !0
          );
        p.scrollTo({ [z ? "left" : "top"]: N, behavior: "smooth" });
      }
      return !0;
    }
    const O = ha().isSafari;
    return (
      y && !i && O && r.isElement && r.virtual.update(!1, !1, o),
      r.setTransition(e),
      r.setTranslate(w),
      r.updateActiveIndex(o),
      r.updateSlidesClasses(),
      r.emit("beforeTransitionStart", e, s),
      r.transitionStart(n, g),
      e === 0
        ? r.transitionEnd(n, g)
        : r.animating ||
          ((r.animating = !0),
          r.onSlideToWrapperTransitionEnd ||
            (r.onSlideToWrapperTransitionEnd = function (N) {
              !r ||
                r.destroyed ||
                (N.target === this &&
                  (r.wrapperEl.removeEventListener(
                    "transitionend",
                    r.onSlideToWrapperTransitionEnd
                  ),
                  (r.onSlideToWrapperTransitionEnd = null),
                  delete r.onSlideToWrapperTransitionEnd,
                  r.transitionEnd(n, g)));
            }),
          r.wrapperEl.addEventListener(
            "transitionend",
            r.onSlideToWrapperTransitionEnd
          )),
      !0
    );
  }
  function Gp(t, e, n, s) {
    t === void 0 && (t = 0),
      n === void 0 && (n = !0),
      typeof t == "string" && (t = parseInt(t, 10));
    const i = this;
    if (i.destroyed) return;
    typeof e == "undefined" && (e = i.params.speed);
    const r = i.grid && i.params.grid && i.params.grid.rows > 1;
    let o = t;
    if (i.params.loop)
      if (i.virtual && i.params.virtual.enabled) o = o + i.virtual.slidesBefore;
      else {
        let l;
        if (r) {
          const f = o * i.params.grid.rows;
          l = i.slides.find(
            (p) => p.getAttribute("data-swiper-slide-index") * 1 === f
          ).column;
        } else l = i.getSlideIndexByData(o);
        const a = r
            ? Math.ceil(i.slides.length / i.params.grid.rows)
            : i.slides.length,
          { centeredSlides: u } = i.params;
        let c = i.params.slidesPerView;
        c === "auto"
          ? (c = i.slidesPerViewDynamic())
          : ((c = Math.ceil(parseFloat(i.params.slidesPerView, 10))),
            u && c % 2 === 0 && (c = c + 1));
        let d = a - l < c;
        if (
          (u && (d = d || l < Math.ceil(c / 2)),
          s && u && i.params.slidesPerView !== "auto" && !r && (d = !1),
          d)
        ) {
          const f = u
            ? l < i.activeIndex
              ? "prev"
              : "next"
            : l - i.activeIndex - 1 < i.params.slidesPerView
            ? "next"
            : "prev";
          i.loopFix({
            direction: f,
            slideTo: !0,
            activeSlideIndex: f === "next" ? l + 1 : l - a + 1,
            slideRealIndex: f === "next" ? i.realIndex : void 0,
          });
        }
        if (r) {
          const f = o * i.params.grid.rows;
          o = i.slides.find(
            (p) => p.getAttribute("data-swiper-slide-index") * 1 === f
          ).column;
        } else o = i.getSlideIndexByData(o);
      }
    return (
      requestAnimationFrame(() => {
        i.slideTo(o, e, n, s);
      }),
      i
    );
  }
  function jp(t, e, n) {
    e === void 0 && (e = !0);
    const s = this,
      { enabled: i, params: r, animating: o } = s;
    if (!i || s.destroyed) return s;
    typeof t == "undefined" && (t = s.params.speed);
    let l = r.slidesPerGroup;
    r.slidesPerView === "auto" &&
      r.slidesPerGroup === 1 &&
      r.slidesPerGroupAuto &&
      (l = Math.max(s.slidesPerViewDynamic("current", !0), 1));
    const a = s.activeIndex < r.slidesPerGroupSkip ? 1 : l,
      u = s.virtual && r.virtual.enabled;
    if (r.loop) {
      if (o && !u && r.loopPreventsSliding) return !1;
      if (
        (s.loopFix({ direction: "next" }),
        (s._clientLeft = s.wrapperEl.clientLeft),
        s.activeIndex === s.slides.length - 1 && r.cssMode)
      )
        return (
          requestAnimationFrame(() => {
            s.slideTo(s.activeIndex + a, t, e, n);
          }),
          !0
        );
    }
    return r.rewind && s.isEnd
      ? s.slideTo(0, t, e, n)
      : s.slideTo(s.activeIndex + a, t, e, n);
  }
  function Vp(t, e, n) {
    e === void 0 && (e = !0);
    const s = this,
      {
        params: i,
        snapGrid: r,
        slidesGrid: o,
        rtlTranslate: l,
        enabled: a,
        animating: u,
      } = s;
    if (!a || s.destroyed) return s;
    typeof t == "undefined" && (t = s.params.speed);
    const c = s.virtual && i.virtual.enabled;
    if (i.loop) {
      if (u && !c && i.loopPreventsSliding) return !1;
      s.loopFix({ direction: "prev" }),
        (s._clientLeft = s.wrapperEl.clientLeft);
    }
    const d = l ? s.translate : -s.translate;
    function f(g) {
      return g < 0 ? -Math.floor(Math.abs(g)) : Math.floor(g);
    }
    const p = f(d),
      h = r.map((g) => f(g)),
      m = i.freeMode && i.freeMode.enabled;
    let b = r[h.indexOf(p) - 1];
    if (typeof b == "undefined" && (i.cssMode || m)) {
      let g;
      r.forEach((y, E) => {
        p >= y && (g = E);
      }),
        typeof g != "undefined" && (b = m ? r[g] : r[g > 0 ? g - 1 : g]);
    }
    let w = 0;
    if (
      (typeof b != "undefined" &&
        ((w = o.indexOf(b)),
        w < 0 && (w = s.activeIndex - 1),
        i.slidesPerView === "auto" &&
          i.slidesPerGroup === 1 &&
          i.slidesPerGroupAuto &&
          ((w = w - s.slidesPerViewDynamic("previous", !0) + 1),
          (w = Math.max(w, 0)))),
      i.rewind && s.isBeginning)
    ) {
      const g =
        s.params.virtual && s.params.virtual.enabled && s.virtual
          ? s.virtual.slides.length - 1
          : s.slides.length - 1;
      return s.slideTo(g, t, e, n);
    } else if (i.loop && s.activeIndex === 0 && i.cssMode)
      return (
        requestAnimationFrame(() => {
          s.slideTo(w, t, e, n);
        }),
        !0
      );
    return s.slideTo(w, t, e, n);
  }
  function Up(t, e, n) {
    e === void 0 && (e = !0);
    const s = this;
    if (!s.destroyed)
      return (
        typeof t == "undefined" && (t = s.params.speed),
        s.slideTo(s.activeIndex, t, e, n)
      );
  }
  function Wp(t, e, n, s) {
    e === void 0 && (e = !0), s === void 0 && (s = 0.5);
    const i = this;
    if (i.destroyed) return;
    typeof t == "undefined" && (t = i.params.speed);
    let r = i.activeIndex;
    const o = Math.min(i.params.slidesPerGroupSkip, r),
      l = o + Math.floor((r - o) / i.params.slidesPerGroup),
      a = i.rtlTranslate ? i.translate : -i.translate;
    if (a >= i.snapGrid[l]) {
      const u = i.snapGrid[l],
        c = i.snapGrid[l + 1];
      a - u > (c - u) * s && (r += i.params.slidesPerGroup);
    } else {
      const u = i.snapGrid[l - 1],
        c = i.snapGrid[l];
      a - u <= (c - u) * s && (r -= i.params.slidesPerGroup);
    }
    return (
      (r = Math.max(r, 0)),
      (r = Math.min(r, i.slidesGrid.length - 1)),
      i.slideTo(r, t, e, n)
    );
  }
  function qp() {
    const t = this;
    if (t.destroyed) return;
    const { params: e, slidesEl: n } = t,
      s =
        e.slidesPerView === "auto" ? t.slidesPerViewDynamic() : e.slidesPerView;
    let i = t.getSlideIndexWhenGrid(t.clickedIndex),
      r;
    const o = t.isElement ? "swiper-slide" : `.${e.slideClass}`,
      l = t.grid && t.params.grid && t.params.grid.rows > 1;
    if (e.loop) {
      if (t.animating) return;
      (r = parseInt(
        t.clickedSlide.getAttribute("data-swiper-slide-index"),
        10
      )),
        e.centeredSlides
          ? t.slideToLoop(r)
          : i >
            (l
              ? (t.slides.length - s) / 2 - (t.params.grid.rows - 1)
              : t.slides.length - s)
          ? (t.loopFix(),
            (i = t.getSlideIndex(
              bt(n, `${o}[data-swiper-slide-index="${r}"]`)[0]
            )),
            ca(() => {
              t.slideTo(i);
            }))
          : t.slideTo(i);
    } else t.slideTo(i);
  }
  var Kp = {
    slideTo: Dp,
    slideToLoop: Gp,
    slideNext: jp,
    slidePrev: Vp,
    slideReset: Up,
    slideToClosest: Wp,
    slideToClickedSlide: qp,
  };
  function Yp(t, e) {
    const n = this,
      { params: s, slidesEl: i } = n;
    if (!s.loop || (n.virtual && n.params.virtual.enabled)) return;
    const r = () => {
        bt(i, `.${s.slideClass}, swiper-slide`).forEach((p, h) => {
          p.setAttribute("data-swiper-slide-index", h);
        });
      },
      o = () => {
        const f = bt(i, `.${s.slideBlankClass}`);
        f.forEach((p) => {
          p.remove();
        }),
          f.length > 0 && (n.recalcSlides(), n.updateSlides());
      },
      l = n.grid && s.grid && s.grid.rows > 1;
    s.loopAddBlankSlides && (s.slidesPerGroup > 1 || l) && o();
    const a = s.slidesPerGroup * (l ? s.grid.rows : 1),
      u = n.slides.length % a !== 0,
      c = l && n.slides.length % s.grid.rows !== 0,
      d = (f) => {
        for (let p = 0; p < f; p += 1) {
          const h = n.isElement
            ? ts("swiper-slide", [s.slideBlankClass])
            : ts("div", [s.slideClass, s.slideBlankClass]);
          n.slidesEl.append(h);
        }
      };
    if (u) {
      if (s.loopAddBlankSlides) {
        const f = a - (n.slides.length % a);
        d(f), n.recalcSlides(), n.updateSlides();
      } else
        qs(
          "Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)"
        );
      r();
    } else if (c) {
      if (s.loopAddBlankSlides) {
        const f = s.grid.rows - (n.slides.length % s.grid.rows);
        d(f), n.recalcSlides(), n.updateSlides();
      } else
        qs(
          "Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)"
        );
      r();
    } else r();
    n.loopFix({
      slideRealIndex: t,
      direction: s.centeredSlides ? void 0 : "next",
      initial: e,
    });
  }
  function Qp(t) {
    let {
      slideRealIndex: e,
      slideTo: n = !0,
      direction: s,
      setTranslate: i,
      activeSlideIndex: r,
      initial: o,
      byController: l,
      byMousewheel: a,
    } = t === void 0 ? {} : t;
    const u = this;
    if (!u.params.loop) return;
    u.emit("beforeLoopFix");
    const {
        slides: c,
        allowSlidePrev: d,
        allowSlideNext: f,
        slidesEl: p,
        params: h,
      } = u,
      { centeredSlides: m, initialSlide: b } = h;
    if (
      ((u.allowSlidePrev = !0),
      (u.allowSlideNext = !0),
      u.virtual && h.virtual.enabled)
    ) {
      n &&
        (!h.centeredSlides && u.snapIndex === 0
          ? u.slideTo(u.virtual.slides.length, 0, !1, !0)
          : h.centeredSlides && u.snapIndex < h.slidesPerView
          ? u.slideTo(u.virtual.slides.length + u.snapIndex, 0, !1, !0)
          : u.snapIndex === u.snapGrid.length - 1 &&
            u.slideTo(u.virtual.slidesBefore, 0, !1, !0)),
        (u.allowSlidePrev = d),
        (u.allowSlideNext = f),
        u.emit("loopFix");
      return;
    }
    let w = h.slidesPerView;
    w === "auto"
      ? (w = u.slidesPerViewDynamic())
      : ((w = Math.ceil(parseFloat(h.slidesPerView, 10))),
        m && w % 2 === 0 && (w = w + 1));
    const g = h.slidesPerGroupAuto ? w : h.slidesPerGroup;
    let y = m ? Math.max(g, Math.ceil(w / 2)) : g;
    y % g !== 0 && (y += g - (y % g)),
      (y += h.loopAdditionalSlides),
      (u.loopedSlides = y);
    const E = u.grid && h.grid && h.grid.rows > 1;
    c.length < w + y || (u.params.effect === "cards" && c.length < w + y * 2)
      ? qs(
          "Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"
        )
      : E &&
        h.grid.fill === "row" &&
        qs(
          "Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`"
        );
    const C = [],
      O = [],
      z = E ? Math.ceil(c.length / h.grid.rows) : c.length,
      N = o && z - b < w && !m;
    let T = N ? b : u.activeIndex;
    typeof r == "undefined"
      ? (r = u.getSlideIndex(
          c.find((W) => W.classList.contains(h.slideActiveClass))
        ))
      : (T = r);
    const P = s === "next" || !s,
      $ = s === "prev" || !s;
    let R = 0,
      G = 0;
    const re =
      (E ? c[r].column : r) + (m && typeof i == "undefined" ? -w / 2 + 0.5 : 0);
    if (re < y) {
      R = Math.max(y - re, g);
      for (let W = 0; W < y - re; W += 1) {
        const A = W - Math.floor(W / z) * z;
        if (E) {
          const M = z - A - 1;
          for (let Y = c.length - 1; Y >= 0; Y -= 1)
            c[Y].column === M && C.push(Y);
        } else C.push(z - A - 1);
      }
    } else if (re + w > z - y) {
      (G = Math.max(re - (z - y * 2), g)),
        N && (G = Math.max(G, w - z + b + 1));
      for (let W = 0; W < G; W += 1) {
        const A = W - Math.floor(W / z) * z;
        E
          ? c.forEach((M, Y) => {
              M.column === A && O.push(Y);
            })
          : O.push(A);
      }
    }
    if (
      ((u.__preventObserver__ = !0),
      requestAnimationFrame(() => {
        u.__preventObserver__ = !1;
      }),
      u.params.effect === "cards" &&
        c.length < w + y * 2 &&
        (O.includes(r) && O.splice(O.indexOf(r), 1),
        C.includes(r) && C.splice(C.indexOf(r), 1)),
      $ &&
        C.forEach((W) => {
          (c[W].swiperLoopMoveDOM = !0),
            p.prepend(c[W]),
            (c[W].swiperLoopMoveDOM = !1);
        }),
      P &&
        O.forEach((W) => {
          (c[W].swiperLoopMoveDOM = !0),
            p.append(c[W]),
            (c[W].swiperLoopMoveDOM = !1);
        }),
      u.recalcSlides(),
      h.slidesPerView === "auto"
        ? u.updateSlides()
        : E &&
          ((C.length > 0 && $) || (O.length > 0 && P)) &&
          u.slides.forEach((W, A) => {
            u.grid.updateSlide(A, W, u.slides);
          }),
      h.watchSlidesProgress && u.updateSlidesOffset(),
      n)
    ) {
      if (C.length > 0 && $) {
        if (typeof e == "undefined") {
          const W = u.slidesGrid[T],
            M = u.slidesGrid[T + R] - W;
          a
            ? u.setTranslate(u.translate - M)
            : (u.slideTo(T + Math.ceil(R), 0, !1, !0),
              i &&
                ((u.touchEventsData.startTranslate =
                  u.touchEventsData.startTranslate - M),
                (u.touchEventsData.currentTranslate =
                  u.touchEventsData.currentTranslate - M)));
        } else if (i) {
          const W = E ? C.length / h.grid.rows : C.length;
          u.slideTo(u.activeIndex + W, 0, !1, !0),
            (u.touchEventsData.currentTranslate = u.translate);
        }
      } else if (O.length > 0 && P)
        if (typeof e == "undefined") {
          const W = u.slidesGrid[T],
            M = u.slidesGrid[T - G] - W;
          a
            ? u.setTranslate(u.translate - M)
            : (u.slideTo(T - G, 0, !1, !0),
              i &&
                ((u.touchEventsData.startTranslate =
                  u.touchEventsData.startTranslate - M),
                (u.touchEventsData.currentTranslate =
                  u.touchEventsData.currentTranslate - M)));
        } else {
          const W = E ? O.length / h.grid.rows : O.length;
          u.slideTo(u.activeIndex - W, 0, !1, !0);
        }
    }
    if (
      ((u.allowSlidePrev = d),
      (u.allowSlideNext = f),
      u.controller && u.controller.control && !l)
    ) {
      const W = {
        slideRealIndex: e,
        direction: s,
        setTranslate: i,
        activeSlideIndex: r,
        byController: !0,
      };
      Array.isArray(u.controller.control)
        ? u.controller.control.forEach((A) => {
            !A.destroyed &&
              A.params.loop &&
              A.loopFix(
                xt(Ie({}, W), {
                  slideTo: A.params.slidesPerView === h.slidesPerView ? n : !1,
                })
              );
          })
        : u.controller.control instanceof u.constructor &&
          u.controller.control.params.loop &&
          u.controller.control.loopFix(
            xt(Ie({}, W), {
              slideTo:
                u.controller.control.params.slidesPerView === h.slidesPerView
                  ? n
                  : !1,
            })
          );
    }
    u.emit("loopFix");
  }
  function Xp() {
    const t = this,
      { params: e, slidesEl: n } = t;
    if (!e.loop || !n || (t.virtual && t.params.virtual.enabled)) return;
    t.recalcSlides();
    const s = [];
    t.slides.forEach((i) => {
      const r =
        typeof i.swiperSlideIndex == "undefined"
          ? i.getAttribute("data-swiper-slide-index") * 1
          : i.swiperSlideIndex;
      s[r] = i;
    }),
      t.slides.forEach((i) => {
        i.removeAttribute("data-swiper-slide-index");
      }),
      s.forEach((i) => {
        n.append(i);
      }),
      t.recalcSlides(),
      t.slideTo(t.realIndex, 0);
  }
  var Jp = { loopCreate: Yp, loopFix: Qp, loopDestroy: Xp };
  function Zp(t) {
    const e = this;
    if (
      !e.params.simulateTouch ||
      (e.params.watchOverflow && e.isLocked) ||
      e.params.cssMode
    )
      return;
    const n = e.params.touchEventsTarget === "container" ? e.el : e.wrapperEl;
    e.isElement && (e.__preventObserver__ = !0),
      (n.style.cursor = "move"),
      (n.style.cursor = t ? "grabbing" : "grab"),
      e.isElement &&
        requestAnimationFrame(() => {
          e.__preventObserver__ = !1;
        });
  }
  function eh() {
    const t = this;
    (t.params.watchOverflow && t.isLocked) ||
      t.params.cssMode ||
      (t.isElement && (t.__preventObserver__ = !0),
      (t[
        t.params.touchEventsTarget === "container" ? "el" : "wrapperEl"
      ].style.cursor = ""),
      t.isElement &&
        requestAnimationFrame(() => {
          t.__preventObserver__ = !1;
        }));
  }
  var th = { setGrabCursor: Zp, unsetGrabCursor: eh };
  function nh(t, e) {
    e === void 0 && (e = this);
    function n(s) {
      if (!s || s === ot() || s === qe()) return null;
      s.assignedSlot && (s = s.assignedSlot);
      const i = s.closest(t);
      return !i && !s.getRootNode ? null : i || n(s.getRootNode().host);
    }
    return n(e);
  }
  function va(t, e, n) {
    const s = qe(),
      { params: i } = t,
      r = i.edgeSwipeDetection,
      o = i.edgeSwipeThreshold;
    return r && (n <= o || n >= s.innerWidth - o)
      ? r === "prevent"
        ? (e.preventDefault(), !0)
        : !1
      : !0;
  }
  function sh(t) {
    const e = this,
      n = ot();
    let s = t;
    s.originalEvent && (s = s.originalEvent);
    const i = e.touchEventsData;
    if (s.type === "pointerdown") {
      if (i.pointerId !== null && i.pointerId !== s.pointerId) return;
      i.pointerId = s.pointerId;
    } else
      s.type === "touchstart" &&
        s.targetTouches.length === 1 &&
        (i.touchId = s.targetTouches[0].identifier);
    if (s.type === "touchstart") {
      va(e, s, s.targetTouches[0].pageX);
      return;
    }
    const { params: r, touches: o, enabled: l } = e;
    if (
      !l ||
      (!r.simulateTouch && s.pointerType === "mouse") ||
      (e.animating && r.preventInteractionOnTransition)
    )
      return;
    !e.animating && r.cssMode && r.loop && e.loopFix();
    let a = s.target;
    if (
      (r.touchEventsTarget === "wrapper" && !up(a, e.wrapperEl)) ||
      ("which" in s && s.which === 3) ||
      ("button" in s && s.button > 0) ||
      (i.isTouched && i.isMoved)
    )
      return;
    const u = !!r.noSwipingClass && r.noSwipingClass !== "",
      c = s.composedPath ? s.composedPath() : s.path;
    u && s.target && s.target.shadowRoot && c && (a = c[0]);
    const d = r.noSwipingSelector
        ? r.noSwipingSelector
        : `.${r.noSwipingClass}`,
      f = !!(s.target && s.target.shadowRoot);
    if (r.noSwiping && (f ? nh(d, a) : a.closest(d))) {
      e.allowClick = !0;
      return;
    }
    if (r.swipeHandler && !a.closest(r.swipeHandler)) return;
    (o.currentX = s.pageX), (o.currentY = s.pageY);
    const p = o.currentX,
      h = o.currentY;
    if (!va(e, s, p)) return;
    Object.assign(i, {
      isTouched: !0,
      isMoved: !1,
      allowTouchCallbacks: !0,
      isScrolling: void 0,
      startMoving: void 0,
    }),
      (o.startX = p),
      (o.startY = h),
      (i.touchStartTime = Vs()),
      (e.allowClick = !0),
      e.updateSize(),
      (e.swipeDirection = void 0),
      r.threshold > 0 && (i.allowThresholdMove = !1);
    let m = !0;
    a.matches(i.focusableElements) &&
      ((m = !1), a.nodeName === "SELECT" && (i.isTouched = !1)),
      n.activeElement &&
        n.activeElement.matches(i.focusableElements) &&
        n.activeElement !== a &&
        (s.pointerType === "mouse" ||
          (s.pointerType !== "mouse" && !a.matches(i.focusableElements))) &&
        n.activeElement.blur();
    const b = m && e.allowTouchMove && r.touchStartPreventDefault;
    (r.touchStartForcePreventDefault || b) &&
      !a.isContentEditable &&
      s.preventDefault(),
      r.freeMode &&
        r.freeMode.enabled &&
        e.freeMode &&
        e.animating &&
        !r.cssMode &&
        e.freeMode.onTouchStart(),
      e.emit("touchStart", s);
  }
  function ih(t) {
    const e = ot(),
      n = this,
      s = n.touchEventsData,
      { params: i, touches: r, rtlTranslate: o, enabled: l } = n;
    if (!l || (!i.simulateTouch && t.pointerType === "mouse")) return;
    let a = t;
    if (
      (a.originalEvent && (a = a.originalEvent),
      a.type === "pointermove" &&
        (s.touchId !== null || a.pointerId !== s.pointerId))
    )
      return;
    let u;
    if (a.type === "touchmove") {
      if (
        ((u = [...a.changedTouches].find((C) => C.identifier === s.touchId)),
        !u || u.identifier !== s.touchId)
      )
        return;
    } else u = a;
    if (!s.isTouched) {
      s.startMoving && s.isScrolling && n.emit("touchMoveOpposite", a);
      return;
    }
    const c = u.pageX,
      d = u.pageY;
    if (a.preventedByNestedSwiper) {
      (r.startX = c), (r.startY = d);
      return;
    }
    if (!n.allowTouchMove) {
      a.target.matches(s.focusableElements) || (n.allowClick = !1),
        s.isTouched &&
          (Object.assign(r, { startX: c, startY: d, currentX: c, currentY: d }),
          (s.touchStartTime = Vs()));
      return;
    }
    if (i.touchReleaseOnEdges && !i.loop)
      if (n.isVertical()) {
        if (
          (d < r.startY && n.translate <= n.maxTranslate()) ||
          (d > r.startY && n.translate >= n.minTranslate())
        ) {
          (s.isTouched = !1), (s.isMoved = !1);
          return;
        }
      } else {
        if (
          o &&
          ((c > r.startX && -n.translate <= n.maxTranslate()) ||
            (c < r.startX && -n.translate >= n.minTranslate()))
        )
          return;
        if (
          !o &&
          ((c < r.startX && n.translate <= n.maxTranslate()) ||
            (c > r.startX && n.translate >= n.minTranslate()))
        )
          return;
      }
    if (
      (e.activeElement &&
        e.activeElement.matches(s.focusableElements) &&
        e.activeElement !== a.target &&
        a.pointerType !== "mouse" &&
        e.activeElement.blur(),
      e.activeElement &&
        a.target === e.activeElement &&
        a.target.matches(s.focusableElements))
    ) {
      (s.isMoved = !0), (n.allowClick = !1);
      return;
    }
    s.allowTouchCallbacks && n.emit("touchMove", a),
      (r.previousX = r.currentX),
      (r.previousY = r.currentY),
      (r.currentX = c),
      (r.currentY = d);
    const f = r.currentX - r.startX,
      p = r.currentY - r.startY;
    if (
      n.params.threshold &&
      Math.sqrt(dn(f, 2) + dn(p, 2)) < n.params.threshold
    )
      return;
    if (typeof s.isScrolling == "undefined") {
      let C;
      (n.isHorizontal() && r.currentY === r.startY) ||
      (n.isVertical() && r.currentX === r.startX)
        ? (s.isScrolling = !1)
        : f * f + p * p >= 25 &&
          ((C = (Math.atan2(Math.abs(p), Math.abs(f)) * 180) / Math.PI),
          (s.isScrolling = n.isHorizontal()
            ? C > i.touchAngle
            : 90 - C > i.touchAngle));
    }
    if (
      (s.isScrolling && n.emit("touchMoveOpposite", a),
      typeof s.startMoving == "undefined" &&
        (r.currentX !== r.startX || r.currentY !== r.startY) &&
        (s.startMoving = !0),
      s.isScrolling ||
        (a.type === "touchmove" && s.preventTouchMoveFromPointerMove))
    ) {
      s.isTouched = !1;
      return;
    }
    if (!s.startMoving) return;
    (n.allowClick = !1),
      !i.cssMode && a.cancelable && a.preventDefault(),
      i.touchMoveStopPropagation && !i.nested && a.stopPropagation();
    let h = n.isHorizontal() ? f : p,
      m = n.isHorizontal()
        ? r.currentX - r.previousX
        : r.currentY - r.previousY;
    i.oneWayMovement &&
      ((h = Math.abs(h) * (o ? 1 : -1)), (m = Math.abs(m) * (o ? 1 : -1))),
      (r.diff = h),
      (h *= i.touchRatio),
      o && ((h = -h), (m = -m));
    const b = n.touchesDirection;
    (n.swipeDirection = h > 0 ? "prev" : "next"),
      (n.touchesDirection = m > 0 ? "prev" : "next");
    const w = n.params.loop && !i.cssMode,
      g =
        (n.touchesDirection === "next" && n.allowSlideNext) ||
        (n.touchesDirection === "prev" && n.allowSlidePrev);
    if (!s.isMoved) {
      if (
        (w && g && n.loopFix({ direction: n.swipeDirection }),
        (s.startTranslate = n.getTranslate()),
        n.setTransition(0),
        n.animating)
      ) {
        const C = new window.CustomEvent("transitionend", {
          bubbles: !0,
          cancelable: !0,
          detail: { bySwiperTouchMove: !0 },
        });
        n.wrapperEl.dispatchEvent(C);
      }
      (s.allowMomentumBounce = !1),
        i.grabCursor &&
          (n.allowSlideNext === !0 || n.allowSlidePrev === !0) &&
          n.setGrabCursor(!0),
        n.emit("sliderFirstMove", a);
    }
    if (
      (new Date().getTime(),
      i._loopSwapReset !== !1 &&
        s.isMoved &&
        s.allowThresholdMove &&
        b !== n.touchesDirection &&
        w &&
        g &&
        Math.abs(h) >= 1)
    ) {
      Object.assign(r, {
        startX: c,
        startY: d,
        currentX: c,
        currentY: d,
        startTranslate: s.currentTranslate,
      }),
        (s.loopSwapReset = !0),
        (s.startTranslate = s.currentTranslate);
      return;
    }
    n.emit("sliderMove", a),
      (s.isMoved = !0),
      (s.currentTranslate = h + s.startTranslate);
    let y = !0,
      E = i.resistanceRatio;
    if (
      (i.touchReleaseOnEdges && (E = 0),
      h > 0
        ? (w &&
            g &&
            s.allowThresholdMove &&
            s.currentTranslate >
              (i.centeredSlides
                ? n.minTranslate() -
                  n.slidesSizesGrid[n.activeIndex + 1] -
                  (i.slidesPerView !== "auto" &&
                  n.slides.length - i.slidesPerView >= 2
                    ? n.slidesSizesGrid[n.activeIndex + 1] +
                      n.params.spaceBetween
                    : 0) -
                  n.params.spaceBetween
                : n.minTranslate()) &&
            n.loopFix({
              direction: "prev",
              setTranslate: !0,
              activeSlideIndex: 0,
            }),
          s.currentTranslate > n.minTranslate() &&
            ((y = !1),
            i.resistance &&
              (s.currentTranslate =
                n.minTranslate() -
                1 +
                dn(-n.minTranslate() + s.startTranslate + h, E))))
        : h < 0 &&
          (w &&
            g &&
            s.allowThresholdMove &&
            s.currentTranslate <
              (i.centeredSlides
                ? n.maxTranslate() +
                  n.slidesSizesGrid[n.slidesSizesGrid.length - 1] +
                  n.params.spaceBetween +
                  (i.slidesPerView !== "auto" &&
                  n.slides.length - i.slidesPerView >= 2
                    ? n.slidesSizesGrid[n.slidesSizesGrid.length - 1] +
                      n.params.spaceBetween
                    : 0)
                : n.maxTranslate()) &&
            n.loopFix({
              direction: "next",
              setTranslate: !0,
              activeSlideIndex:
                n.slides.length -
                (i.slidesPerView === "auto"
                  ? n.slidesPerViewDynamic()
                  : Math.ceil(parseFloat(i.slidesPerView, 10))),
            }),
          s.currentTranslate < n.maxTranslate() &&
            ((y = !1),
            i.resistance &&
              (s.currentTranslate =
                n.maxTranslate() +
                1 -
                dn(n.maxTranslate() - s.startTranslate - h, E)))),
      y && (a.preventedByNestedSwiper = !0),
      !n.allowSlideNext &&
        n.swipeDirection === "next" &&
        s.currentTranslate < s.startTranslate &&
        (s.currentTranslate = s.startTranslate),
      !n.allowSlidePrev &&
        n.swipeDirection === "prev" &&
        s.currentTranslate > s.startTranslate &&
        (s.currentTranslate = s.startTranslate),
      !n.allowSlidePrev &&
        !n.allowSlideNext &&
        (s.currentTranslate = s.startTranslate),
      i.threshold > 0)
    )
      if (Math.abs(h) > i.threshold || s.allowThresholdMove) {
        if (!s.allowThresholdMove) {
          (s.allowThresholdMove = !0),
            (r.startX = r.currentX),
            (r.startY = r.currentY),
            (s.currentTranslate = s.startTranslate),
            (r.diff = n.isHorizontal()
              ? r.currentX - r.startX
              : r.currentY - r.startY);
          return;
        }
      } else {
        s.currentTranslate = s.startTranslate;
        return;
      }
    !i.followFinger ||
      i.cssMode ||
      (((i.freeMode && i.freeMode.enabled && n.freeMode) ||
        i.watchSlidesProgress) &&
        (n.updateActiveIndex(), n.updateSlidesClasses()),
      i.freeMode &&
        i.freeMode.enabled &&
        n.freeMode &&
        n.freeMode.onTouchMove(),
      n.updateProgress(s.currentTranslate),
      n.setTranslate(s.currentTranslate));
  }
  function rh(t) {
    const e = this,
      n = e.touchEventsData;
    let s = t;
    s.originalEvent && (s = s.originalEvent);
    let i;
    if (s.type === "touchend" || s.type === "touchcancel") {
      if (
        ((i = [...s.changedTouches].find((C) => C.identifier === n.touchId)),
        !i || i.identifier !== n.touchId)
      )
        return;
    } else {
      if (n.touchId !== null || s.pointerId !== n.pointerId) return;
      i = s;
    }
    if (
      ["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(
        s.type
      ) &&
      !(
        ["pointercancel", "contextmenu"].includes(s.type) &&
        (e.browser.isSafari || e.browser.isWebView)
      )
    )
      return;
    (n.pointerId = null), (n.touchId = null);
    const {
      params: o,
      touches: l,
      rtlTranslate: a,
      slidesGrid: u,
      enabled: c,
    } = e;
    if (!c || (!o.simulateTouch && s.pointerType === "mouse")) return;
    if (
      (n.allowTouchCallbacks && e.emit("touchEnd", s),
      (n.allowTouchCallbacks = !1),
      !n.isTouched)
    ) {
      n.isMoved && o.grabCursor && e.setGrabCursor(!1),
        (n.isMoved = !1),
        (n.startMoving = !1);
      return;
    }
    o.grabCursor &&
      n.isMoved &&
      n.isTouched &&
      (e.allowSlideNext === !0 || e.allowSlidePrev === !0) &&
      e.setGrabCursor(!1);
    const d = Vs(),
      f = d - n.touchStartTime;
    if (e.allowClick) {
      const C = s.path || (s.composedPath && s.composedPath());
      e.updateClickedSlide((C && C[0]) || s.target, C),
        e.emit("tap click", s),
        f < 300 &&
          d - n.lastClickTime < 300 &&
          e.emit("doubleTap doubleClick", s);
    }
    if (
      ((n.lastClickTime = Vs()),
      ca(() => {
        e.destroyed || (e.allowClick = !0);
      }),
      !n.isTouched ||
        !n.isMoved ||
        !e.swipeDirection ||
        (l.diff === 0 && !n.loopSwapReset) ||
        (n.currentTranslate === n.startTranslate && !n.loopSwapReset))
    ) {
      (n.isTouched = !1), (n.isMoved = !1), (n.startMoving = !1);
      return;
    }
    (n.isTouched = !1), (n.isMoved = !1), (n.startMoving = !1);
    let p;
    if (
      (o.followFinger
        ? (p = a ? e.translate : -e.translate)
        : (p = -n.currentTranslate),
      o.cssMode)
    )
      return;
    if (o.freeMode && o.freeMode.enabled) {
      e.freeMode.onTouchEnd({ currentPos: p });
      return;
    }
    const h = p >= -e.maxTranslate() && !e.params.loop;
    let m = 0,
      b = e.slidesSizesGrid[0];
    for (
      let C = 0;
      C < u.length;
      C += C < o.slidesPerGroupSkip ? 1 : o.slidesPerGroup
    ) {
      const O = C < o.slidesPerGroupSkip - 1 ? 1 : o.slidesPerGroup;
      typeof u[C + O] != "undefined"
        ? (h || (p >= u[C] && p < u[C + O])) && ((m = C), (b = u[C + O] - u[C]))
        : (h || p >= u[C]) &&
          ((m = C), (b = u[u.length - 1] - u[u.length - 2]));
    }
    let w = null,
      g = null;
    o.rewind &&
      (e.isBeginning
        ? (g =
            o.virtual && o.virtual.enabled && e.virtual
              ? e.virtual.slides.length - 1
              : e.slides.length - 1)
        : e.isEnd && (w = 0));
    const y = (p - u[m]) / b,
      E = m < o.slidesPerGroupSkip - 1 ? 1 : o.slidesPerGroup;
    if (f > o.longSwipesMs) {
      if (!o.longSwipes) {
        e.slideTo(e.activeIndex);
        return;
      }
      e.swipeDirection === "next" &&
        (y >= o.longSwipesRatio
          ? e.slideTo(o.rewind && e.isEnd ? w : m + E)
          : e.slideTo(m)),
        e.swipeDirection === "prev" &&
          (y > 1 - o.longSwipesRatio
            ? e.slideTo(m + E)
            : g !== null && y < 0 && Math.abs(y) > o.longSwipesRatio
            ? e.slideTo(g)
            : e.slideTo(m));
    } else {
      if (!o.shortSwipes) {
        e.slideTo(e.activeIndex);
        return;
      }
      e.navigation &&
      (s.target === e.navigation.nextEl || s.target === e.navigation.prevEl)
        ? s.target === e.navigation.nextEl
          ? e.slideTo(m + E)
          : e.slideTo(m)
        : (e.swipeDirection === "next" && e.slideTo(w !== null ? w : m + E),
          e.swipeDirection === "prev" && e.slideTo(g !== null ? g : m));
    }
  }
  function ya() {
    const t = this,
      { params: e, el: n } = t;
    if (n && n.offsetWidth === 0) return;
    e.breakpoints && t.setBreakpoint();
    const { allowSlideNext: s, allowSlidePrev: i, snapGrid: r } = t,
      o = t.virtual && t.params.virtual.enabled;
    (t.allowSlideNext = !0),
      (t.allowSlidePrev = !0),
      t.updateSize(),
      t.updateSlides(),
      t.updateSlidesClasses();
    const l = o && e.loop;
    (e.slidesPerView === "auto" || e.slidesPerView > 1) &&
    t.isEnd &&
    !t.isBeginning &&
    !t.params.centeredSlides &&
    !l
      ? t.slideTo(t.slides.length - 1, 0, !1, !0)
      : t.params.loop && !o
      ? t.slideToLoop(t.realIndex, 0, !1, !0)
      : t.slideTo(t.activeIndex, 0, !1, !0),
      t.autoplay &&
        t.autoplay.running &&
        t.autoplay.paused &&
        (clearTimeout(t.autoplay.resizeTimeout),
        (t.autoplay.resizeTimeout = setTimeout(() => {
          t.autoplay &&
            t.autoplay.running &&
            t.autoplay.paused &&
            t.autoplay.resume();
        }, 500))),
      (t.allowSlidePrev = i),
      (t.allowSlideNext = s),
      t.params.watchOverflow && r !== t.snapGrid && t.checkOverflow();
  }
  function oh(t) {
    const e = this;
    e.enabled &&
      (e.allowClick ||
        (e.params.preventClicks && t.preventDefault(),
        e.params.preventClicksPropagation &&
          e.animating &&
          (t.stopPropagation(), t.stopImmediatePropagation())));
  }
  function lh() {
    const t = this,
      { wrapperEl: e, rtlTranslate: n, enabled: s } = t;
    if (!s) return;
    (t.previousTranslate = t.translate),
      t.isHorizontal()
        ? (t.translate = -e.scrollLeft)
        : (t.translate = -e.scrollTop),
      t.translate === 0 && (t.translate = 0),
      t.updateActiveIndex(),
      t.updateSlidesClasses();
    let i;
    const r = t.maxTranslate() - t.minTranslate();
    r === 0 ? (i = 0) : (i = (t.translate - t.minTranslate()) / r),
      i !== t.progress && t.updateProgress(n ? -t.translate : t.translate),
      t.emit("setTranslate", t.translate, !1);
  }
  function ah(t) {
    const e = this;
    Ks(e, t.target),
      !(
        e.params.cssMode ||
        (e.params.slidesPerView !== "auto" && !e.params.autoHeight)
      ) && e.update();
  }
  function ch() {
    const t = this;
    t.documentTouchHandlerProceeded ||
      ((t.documentTouchHandlerProceeded = !0),
      t.params.touchReleaseOnEdges && (t.el.style.touchAction = "auto"));
  }
  const ba = (t, e) => {
    const n = ot(),
      { params: s, el: i, wrapperEl: r, device: o } = t,
      l = !!s.nested,
      a = e === "on" ? "addEventListener" : "removeEventListener",
      u = e;
    !i ||
      typeof i == "string" ||
      (n[a]("touchstart", t.onDocumentTouchStart, { passive: !1, capture: l }),
      i[a]("touchstart", t.onTouchStart, { passive: !1 }),
      i[a]("pointerdown", t.onTouchStart, { passive: !1 }),
      n[a]("touchmove", t.onTouchMove, { passive: !1, capture: l }),
      n[a]("pointermove", t.onTouchMove, { passive: !1, capture: l }),
      n[a]("touchend", t.onTouchEnd, { passive: !0 }),
      n[a]("pointerup", t.onTouchEnd, { passive: !0 }),
      n[a]("pointercancel", t.onTouchEnd, { passive: !0 }),
      n[a]("touchcancel", t.onTouchEnd, { passive: !0 }),
      n[a]("pointerout", t.onTouchEnd, { passive: !0 }),
      n[a]("pointerleave", t.onTouchEnd, { passive: !0 }),
      n[a]("contextmenu", t.onTouchEnd, { passive: !0 }),
      (s.preventClicks || s.preventClicksPropagation) &&
        i[a]("click", t.onClick, !0),
      s.cssMode && r[a]("scroll", t.onScroll),
      s.updateOnWindowResize
        ? t[u](
            o.ios || o.android
              ? "resize orientationchange observerUpdate"
              : "resize observerUpdate",
            ya,
            !0
          )
        : t[u]("observerUpdate", ya, !0),
      i[a]("load", t.onLoad, { capture: !0 }));
  };
  function dh() {
    const t = this,
      { params: e } = t;
    (t.onTouchStart = sh.bind(t)),
      (t.onTouchMove = ih.bind(t)),
      (t.onTouchEnd = rh.bind(t)),
      (t.onDocumentTouchStart = ch.bind(t)),
      e.cssMode && (t.onScroll = lh.bind(t)),
      (t.onClick = oh.bind(t)),
      (t.onLoad = ah.bind(t)),
      ba(t, "on");
  }
  function uh() {
    ba(this, "off");
  }
  var fh = { attachEvents: dh, detachEvents: uh };
  const wa = (t, e) => t.grid && e.grid && e.grid.rows > 1;
  function ph() {
    const t = this,
      { realIndex: e, initialized: n, params: s, el: i } = t,
      r = s.breakpoints;
    if (!r || (r && Object.keys(r).length === 0)) return;
    const o = ot(),
      l =
        s.breakpointsBase === "window" || !s.breakpointsBase
          ? s.breakpointsBase
          : "container",
      a =
        ["window", "container"].includes(s.breakpointsBase) ||
        !s.breakpointsBase
          ? t.el
          : o.querySelector(s.breakpointsBase),
      u = t.getBreakpoint(r, l, a);
    if (!u || t.currentBreakpoint === u) return;
    const d = (u in r ? r[u] : void 0) || t.originalParams,
      f = wa(t, s),
      p = wa(t, d),
      h = t.params.grabCursor,
      m = d.grabCursor,
      b = s.enabled;
    f && !p
      ? (i.classList.remove(
          `${s.containerModifierClass}grid`,
          `${s.containerModifierClass}grid-column`
        ),
        t.emitContainerClasses())
      : !f &&
        p &&
        (i.classList.add(`${s.containerModifierClass}grid`),
        ((d.grid.fill && d.grid.fill === "column") ||
          (!d.grid.fill && s.grid.fill === "column")) &&
          i.classList.add(`${s.containerModifierClass}grid-column`),
        t.emitContainerClasses()),
      h && !m ? t.unsetGrabCursor() : !h && m && t.setGrabCursor(),
      ["navigation", "pagination", "scrollbar"].forEach((O) => {
        if (typeof d[O] == "undefined") return;
        const z = s[O] && s[O].enabled,
          N = d[O] && d[O].enabled;
        z && !N && t[O].disable(), !z && N && t[O].enable();
      });
    const w = d.direction && d.direction !== s.direction,
      g = s.loop && (d.slidesPerView !== s.slidesPerView || w),
      y = s.loop;
    w && n && t.changeDirection(), et(t.params, d);
    const E = t.params.enabled,
      C = t.params.loop;
    Object.assign(t, {
      allowTouchMove: t.params.allowTouchMove,
      allowSlideNext: t.params.allowSlideNext,
      allowSlidePrev: t.params.allowSlidePrev,
    }),
      b && !E ? t.disable() : !b && E && t.enable(),
      (t.currentBreakpoint = u),
      t.emit("_beforeBreakpoint", d),
      n &&
        (g
          ? (t.loopDestroy(), t.loopCreate(e), t.updateSlides())
          : !y && C
          ? (t.loopCreate(e), t.updateSlides())
          : y && !C && t.loopDestroy()),
      t.emit("breakpoint", d);
  }
  function hh(t, e, n) {
    if ((e === void 0 && (e = "window"), !t || (e === "container" && !n)))
      return;
    let s = !1;
    const i = qe(),
      r = e === "window" ? i.innerHeight : n.clientHeight,
      o = Object.keys(t).map((l) => {
        if (typeof l == "string" && l.indexOf("@") === 0) {
          const a = parseFloat(l.substr(1));
          return { value: r * a, point: l };
        }
        return { value: l, point: l };
      });
    o.sort((l, a) => parseInt(l.value, 10) - parseInt(a.value, 10));
    for (let l = 0; l < o.length; l += 1) {
      const { point: a, value: u } = o[l];
      e === "window"
        ? i.matchMedia(`(min-width: ${u}px)`).matches && (s = a)
        : u <= n.clientWidth && (s = a);
    }
    return s || "max";
  }
  var gh = { setBreakpoint: ph, getBreakpoint: hh };
  function mh(t, e) {
    const n = [];
    return (
      t.forEach((s) => {
        typeof s == "object"
          ? Object.keys(s).forEach((i) => {
              s[i] && n.push(e + i);
            })
          : typeof s == "string" && n.push(e + s);
      }),
      n
    );
  }
  function vh() {
    const t = this,
      { classNames: e, params: n, rtl: s, el: i, device: r } = t,
      o = mh(
        [
          "initialized",
          n.direction,
          { "free-mode": t.params.freeMode && n.freeMode.enabled },
          { autoheight: n.autoHeight },
          { rtl: s },
          { grid: n.grid && n.grid.rows > 1 },
          {
            "grid-column":
              n.grid && n.grid.rows > 1 && n.grid.fill === "column",
          },
          { android: r.android },
          { ios: r.ios },
          { "css-mode": n.cssMode },
          { centered: n.cssMode && n.centeredSlides },
          { "watch-progress": n.watchSlidesProgress },
        ],
        n.containerModifierClass
      );
    e.push(...o), i.classList.add(...e), t.emitContainerClasses();
  }
  function yh() {
    const t = this,
      { el: e, classNames: n } = t;
    !e ||
      typeof e == "string" ||
      (e.classList.remove(...n), t.emitContainerClasses());
  }
  var bh = { addClasses: vh, removeClasses: yh };
  function wh() {
    const t = this,
      { isLocked: e, params: n } = t,
      { slidesOffsetBefore: s } = n;
    if (s) {
      const i = t.slides.length - 1,
        r = t.slidesGrid[i] + t.slidesSizesGrid[i] + s * 2;
      t.isLocked = t.size > r;
    } else t.isLocked = t.snapGrid.length === 1;
    n.allowSlideNext === !0 && (t.allowSlideNext = !t.isLocked),
      n.allowSlidePrev === !0 && (t.allowSlidePrev = !t.isLocked),
      e && e !== t.isLocked && (t.isEnd = !1),
      e !== t.isLocked && t.emit(t.isLocked ? "lock" : "unlock");
  }
  var _h = { checkOverflow: wh },
    cr = {
      init: !0,
      direction: "horizontal",
      oneWayMovement: !1,
      swiperElementNodeName: "SWIPER-CONTAINER",
      touchEventsTarget: "wrapper",
      initialSlide: 0,
      speed: 300,
      cssMode: !1,
      updateOnWindowResize: !0,
      resizeObserver: !0,
      nested: !1,
      createElements: !1,
      eventsPrefix: "swiper",
      enabled: !0,
      focusableElements:
        "input, select, option, textarea, button, video, label",
      width: null,
      height: null,
      preventInteractionOnTransition: !1,
      userAgent: null,
      url: null,
      edgeSwipeDetection: !1,
      edgeSwipeThreshold: 20,
      autoHeight: !1,
      setWrapperSize: !1,
      virtualTranslate: !1,
      effect: "slide",
      breakpoints: void 0,
      breakpointsBase: "window",
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      slidesPerGroupSkip: 0,
      slidesPerGroupAuto: !1,
      centeredSlides: !1,
      centeredSlidesBounds: !1,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      normalizeSlideIndex: !0,
      centerInsufficientSlides: !1,
      watchOverflow: !0,
      roundLengths: !1,
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: !0,
      shortSwipes: !0,
      longSwipes: !0,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: !0,
      allowTouchMove: !0,
      threshold: 5,
      touchMoveStopPropagation: !1,
      touchStartPreventDefault: !0,
      touchStartForcePreventDefault: !1,
      touchReleaseOnEdges: !1,
      uniqueNavElements: !0,
      resistance: !0,
      resistanceRatio: 0.85,
      watchSlidesProgress: !1,
      grabCursor: !1,
      preventClicks: !0,
      preventClicksPropagation: !0,
      slideToClickedSlide: !1,
      loop: !1,
      loopAddBlankSlides: !0,
      loopAdditionalSlides: 0,
      loopPreventsSliding: !0,
      rewind: !1,
      allowSlidePrev: !0,
      allowSlideNext: !0,
      swipeHandler: null,
      noSwiping: !0,
      noSwipingClass: "swiper-no-swiping",
      noSwipingSelector: null,
      passiveListeners: !0,
      maxBackfaceHiddenSlides: 10,
      containerModifierClass: "swiper-",
      slideClass: "swiper-slide",
      slideBlankClass: "swiper-slide-blank",
      slideActiveClass: "swiper-slide-active",
      slideVisibleClass: "swiper-slide-visible",
      slideFullyVisibleClass: "swiper-slide-fully-visible",
      slideNextClass: "swiper-slide-next",
      slidePrevClass: "swiper-slide-prev",
      wrapperClass: "swiper-wrapper",
      lazyPreloaderClass: "swiper-lazy-preloader",
      lazyPreloadPrevNext: 0,
      runCallbacksOnInit: !0,
      _emitClasses: !1,
    };
  function Sh(t, e) {
    return function (s) {
      s === void 0 && (s = {});
      const i = Object.keys(s)[0],
        r = s[i];
      if (typeof r != "object" || r === null) {
        et(e, s);
        return;
      }
      if (
        (t[i] === !0 && (t[i] = { enabled: !0 }),
        i === "navigation" &&
          t[i] &&
          t[i].enabled &&
          !t[i].prevEl &&
          !t[i].nextEl &&
          (t[i].auto = !0),
        ["pagination", "scrollbar"].indexOf(i) >= 0 &&
          t[i] &&
          t[i].enabled &&
          !t[i].el &&
          (t[i].auto = !0),
        !(i in t && "enabled" in r))
      ) {
        et(e, s);
        return;
      }
      typeof t[i] == "object" && !("enabled" in t[i]) && (t[i].enabled = !0),
        t[i] || (t[i] = { enabled: !1 }),
        et(e, s);
    };
  }
  const dr = {
      eventsEmitter: bp,
      update: Lp,
      translate: $p,
      transition: Fp,
      slide: Kp,
      loop: Jp,
      grabCursor: th,
      events: fh,
      breakpoints: gh,
      checkOverflow: _h,
      classes: bh,
    },
    ur = {};
  let fr = class $t {
    constructor() {
      let e, n;
      for (var s = arguments.length, i = new Array(s), r = 0; r < s; r++)
        i[r] = arguments[r];
      i.length === 1 &&
      i[0].constructor &&
      Object.prototype.toString.call(i[0]).slice(8, -1) === "Object"
        ? (n = i[0])
        : ([e, n] = i),
        n || (n = {}),
        (n = et({}, n)),
        e && !n.el && (n.el = e);
      const o = ot();
      if (
        n.el &&
        typeof n.el == "string" &&
        o.querySelectorAll(n.el).length > 1
      ) {
        const c = [];
        return (
          o.querySelectorAll(n.el).forEach((d) => {
            const f = et({}, n, { el: d });
            c.push(new $t(f));
          }),
          c
        );
      }
      const l = this;
      (l.__swiper__ = !0),
        (l.support = fa()),
        (l.device = pa({ userAgent: n.userAgent })),
        (l.browser = ha()),
        (l.eventsListeners = {}),
        (l.eventsAnyListeners = []),
        (l.modules = [...l.__modules__]),
        n.modules && Array.isArray(n.modules) && l.modules.push(...n.modules);
      const a = {};
      l.modules.forEach((c) => {
        c({
          params: n,
          swiper: l,
          extendParams: Sh(n, a),
          on: l.on.bind(l),
          once: l.once.bind(l),
          off: l.off.bind(l),
          emit: l.emit.bind(l),
        });
      });
      const u = et({}, cr, a);
      return (
        (l.params = et({}, u, ur, n)),
        (l.originalParams = et({}, l.params)),
        (l.passedParams = et({}, n)),
        l.params &&
          l.params.on &&
          Object.keys(l.params.on).forEach((c) => {
            l.on(c, l.params.on[c]);
          }),
        l.params && l.params.onAny && l.onAny(l.params.onAny),
        Object.assign(l, {
          enabled: l.params.enabled,
          el: e,
          classNames: [],
          slides: [],
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal() {
            return l.params.direction === "horizontal";
          },
          isVertical() {
            return l.params.direction === "vertical";
          },
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          cssOverflowAdjustment() {
            return Math.trunc(this.translate / dn(2, 23)) * dn(2, 23);
          },
          allowSlideNext: l.params.allowSlideNext,
          allowSlidePrev: l.params.allowSlidePrev,
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            focusableElements: l.params.focusableElements,
            lastClickTime: 0,
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            startMoving: void 0,
            pointerId: null,
            touchId: null,
          },
          allowClick: !0,
          allowTouchMove: l.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        l.emit("_swiper"),
        l.params.init && l.init(),
        l
      );
    }
    getDirectionLabel(e) {
      return this.isHorizontal()
        ? e
        : {
            width: "height",
            "margin-top": "margin-left",
            "margin-bottom ": "margin-right",
            "margin-left": "margin-top",
            "margin-right": "margin-bottom",
            "padding-left": "padding-top",
            "padding-right": "padding-bottom",
            marginRight: "marginBottom",
          }[e];
    }
    getSlideIndex(e) {
      const { slidesEl: n, params: s } = this,
        i = bt(n, `.${s.slideClass}, swiper-slide`),
        r = ns(i[0]);
      return ns(e) - r;
    }
    getSlideIndexByData(e) {
      return this.getSlideIndex(
        this.slides.find(
          (n) => n.getAttribute("data-swiper-slide-index") * 1 === e
        )
      );
    }
    getSlideIndexWhenGrid(e) {
      return (
        this.grid &&
          this.params.grid &&
          this.params.grid.rows > 1 &&
          (this.params.grid.fill === "column"
            ? (e = Math.floor(e / this.params.grid.rows))
            : this.params.grid.fill === "row" &&
              (e = e % Math.ceil(this.slides.length / this.params.grid.rows))),
        e
      );
    }
    recalcSlides() {
      const e = this,
        { slidesEl: n, params: s } = e;
      e.slides = bt(n, `.${s.slideClass}, swiper-slide`);
    }
    enable() {
      const e = this;
      e.enabled ||
        ((e.enabled = !0),
        e.params.grabCursor && e.setGrabCursor(),
        e.emit("enable"));
    }
    disable() {
      const e = this;
      e.enabled &&
        ((e.enabled = !1),
        e.params.grabCursor && e.unsetGrabCursor(),
        e.emit("disable"));
    }
    setProgress(e, n) {
      const s = this;
      e = Math.min(Math.max(e, 0), 1);
      const i = s.minTranslate(),
        o = (s.maxTranslate() - i) * e + i;
      s.translateTo(o, typeof n == "undefined" ? 0 : n),
        s.updateActiveIndex(),
        s.updateSlidesClasses();
    }
    emitContainerClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const n = e.el.className
        .split(" ")
        .filter(
          (s) =>
            s.indexOf("swiper") === 0 ||
            s.indexOf(e.params.containerModifierClass) === 0
        );
      e.emit("_containerClasses", n.join(" "));
    }
    getSlideClasses(e) {
      const n = this;
      return n.destroyed
        ? ""
        : e.className
            .split(" ")
            .filter(
              (s) =>
                s.indexOf("swiper-slide") === 0 ||
                s.indexOf(n.params.slideClass) === 0
            )
            .join(" ");
    }
    emitSlidesClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const n = [];
      e.slides.forEach((s) => {
        const i = e.getSlideClasses(s);
        n.push({ slideEl: s, classNames: i }), e.emit("_slideClass", s, i);
      }),
        e.emit("_slideClasses", n);
    }
    slidesPerViewDynamic(e, n) {
      e === void 0 && (e = "current"), n === void 0 && (n = !1);
      const s = this,
        {
          params: i,
          slides: r,
          slidesGrid: o,
          slidesSizesGrid: l,
          size: a,
          activeIndex: u,
        } = s;
      let c = 1;
      if (typeof i.slidesPerView == "number") return i.slidesPerView;
      if (i.centeredSlides) {
        let d = r[u] ? Math.ceil(r[u].swiperSlideSize) : 0,
          f;
        for (let p = u + 1; p < r.length; p += 1)
          r[p] &&
            !f &&
            ((d += Math.ceil(r[p].swiperSlideSize)),
            (c += 1),
            d > a && (f = !0));
        for (let p = u - 1; p >= 0; p -= 1)
          r[p] &&
            !f &&
            ((d += r[p].swiperSlideSize), (c += 1), d > a && (f = !0));
      } else if (e === "current")
        for (let d = u + 1; d < r.length; d += 1)
          (n ? o[d] + l[d] - o[u] < a : o[d] - o[u] < a) && (c += 1);
      else for (let d = u - 1; d >= 0; d -= 1) o[u] - o[d] < a && (c += 1);
      return c;
    }
    update() {
      const e = this;
      if (!e || e.destroyed) return;
      const { snapGrid: n, params: s } = e;
      s.breakpoints && e.setBreakpoint(),
        [...e.el.querySelectorAll('[loading="lazy"]')].forEach((o) => {
          o.complete && Ks(e, o);
        }),
        e.updateSize(),
        e.updateSlides(),
        e.updateProgress(),
        e.updateSlidesClasses();
      function i() {
        const o = e.rtlTranslate ? e.translate * -1 : e.translate,
          l = Math.min(Math.max(o, e.maxTranslate()), e.minTranslate());
        e.setTranslate(l), e.updateActiveIndex(), e.updateSlidesClasses();
      }
      let r;
      if (s.freeMode && s.freeMode.enabled && !s.cssMode)
        i(), s.autoHeight && e.updateAutoHeight();
      else {
        if (
          (s.slidesPerView === "auto" || s.slidesPerView > 1) &&
          e.isEnd &&
          !s.centeredSlides
        ) {
          const o =
            e.virtual && s.virtual.enabled ? e.virtual.slides : e.slides;
          r = e.slideTo(o.length - 1, 0, !1, !0);
        } else r = e.slideTo(e.activeIndex, 0, !1, !0);
        r || i();
      }
      s.watchOverflow && n !== e.snapGrid && e.checkOverflow(),
        e.emit("update");
    }
    changeDirection(e, n) {
      n === void 0 && (n = !0);
      const s = this,
        i = s.params.direction;
      return (
        e || (e = i === "horizontal" ? "vertical" : "horizontal"),
        e === i ||
          (e !== "horizontal" && e !== "vertical") ||
          (s.el.classList.remove(`${s.params.containerModifierClass}${i}`),
          s.el.classList.add(`${s.params.containerModifierClass}${e}`),
          s.emitContainerClasses(),
          (s.params.direction = e),
          s.slides.forEach((r) => {
            e === "vertical" ? (r.style.width = "") : (r.style.height = "");
          }),
          s.emit("changeDirection"),
          n && s.update()),
        s
      );
    }
    changeLanguageDirection(e) {
      const n = this;
      (n.rtl && e === "rtl") ||
        (!n.rtl && e === "ltr") ||
        ((n.rtl = e === "rtl"),
        (n.rtlTranslate = n.params.direction === "horizontal" && n.rtl),
        n.rtl
          ? (n.el.classList.add(`${n.params.containerModifierClass}rtl`),
            (n.el.dir = "rtl"))
          : (n.el.classList.remove(`${n.params.containerModifierClass}rtl`),
            (n.el.dir = "ltr")),
        n.update());
    }
    mount(e) {
      const n = this;
      if (n.mounted) return !0;
      let s = e || n.params.el;
      if ((typeof s == "string" && (s = document.querySelector(s)), !s))
        return !1;
      (s.swiper = n),
        s.parentNode &&
          s.parentNode.host &&
          s.parentNode.host.nodeName ===
            n.params.swiperElementNodeName.toUpperCase() &&
          (n.isElement = !0);
      const i = () =>
        `.${(n.params.wrapperClass || "").trim().split(" ").join(".")}`;
      let o =
        s && s.shadowRoot && s.shadowRoot.querySelector
          ? s.shadowRoot.querySelector(i())
          : bt(s, i())[0];
      return (
        !o &&
          n.params.createElements &&
          ((o = ts("div", n.params.wrapperClass)),
          s.append(o),
          bt(s, `.${n.params.slideClass}`).forEach((l) => {
            o.append(l);
          })),
        Object.assign(n, {
          el: s,
          wrapperEl: o,
          slidesEl:
            n.isElement && !s.parentNode.host.slideSlots
              ? s.parentNode.host
              : o,
          hostEl: n.isElement ? s.parentNode.host : s,
          mounted: !0,
          rtl: s.dir.toLowerCase() === "rtl" || Qt(s, "direction") === "rtl",
          rtlTranslate:
            n.params.direction === "horizontal" &&
            (s.dir.toLowerCase() === "rtl" || Qt(s, "direction") === "rtl"),
          wrongRTL: Qt(o, "display") === "-webkit-box",
        }),
        !0
      );
    }
    init(e) {
      const n = this;
      if (n.initialized || n.mount(e) === !1) return n;
      n.emit("beforeInit"),
        n.params.breakpoints && n.setBreakpoint(),
        n.addClasses(),
        n.updateSize(),
        n.updateSlides(),
        n.params.watchOverflow && n.checkOverflow(),
        n.params.grabCursor && n.enabled && n.setGrabCursor(),
        n.params.loop && n.virtual && n.params.virtual.enabled
          ? n.slideTo(
              n.params.initialSlide + n.virtual.slidesBefore,
              0,
              n.params.runCallbacksOnInit,
              !1,
              !0
            )
          : n.slideTo(
              n.params.initialSlide,
              0,
              n.params.runCallbacksOnInit,
              !1,
              !0
            ),
        n.params.loop && n.loopCreate(void 0, !0),
        n.attachEvents();
      const i = [...n.el.querySelectorAll('[loading="lazy"]')];
      return (
        n.isElement && i.push(...n.hostEl.querySelectorAll('[loading="lazy"]')),
        i.forEach((r) => {
          r.complete
            ? Ks(n, r)
            : r.addEventListener("load", (o) => {
                Ks(n, o.target);
              });
        }),
        ar(n),
        (n.initialized = !0),
        ar(n),
        n.emit("init"),
        n.emit("afterInit"),
        n
      );
    }
    destroy(e, n) {
      e === void 0 && (e = !0), n === void 0 && (n = !0);
      const s = this,
        { params: i, el: r, wrapperEl: o, slides: l } = s;
      return (
        typeof s.params == "undefined" ||
          s.destroyed ||
          (s.emit("beforeDestroy"),
          (s.initialized = !1),
          s.detachEvents(),
          i.loop && s.loopDestroy(),
          n &&
            (s.removeClasses(),
            r && typeof r != "string" && r.removeAttribute("style"),
            o && o.removeAttribute("style"),
            l &&
              l.length &&
              l.forEach((a) => {
                a.classList.remove(
                  i.slideVisibleClass,
                  i.slideFullyVisibleClass,
                  i.slideActiveClass,
                  i.slideNextClass,
                  i.slidePrevClass
                ),
                  a.removeAttribute("style"),
                  a.removeAttribute("data-swiper-slide-index");
              })),
          s.emit("destroy"),
          Object.keys(s.eventsListeners).forEach((a) => {
            s.off(a);
          }),
          e !== !1 &&
            (s.el && typeof s.el != "string" && (s.el.swiper = null), op(s)),
          (s.destroyed = !0)),
        null
      );
    }
    static extendDefaults(e) {
      et(ur, e);
    }
    static get extendedDefaults() {
      return ur;
    }
    static get defaults() {
      return cr;
    }
    static installModule(e) {
      $t.prototype.__modules__ || ($t.prototype.__modules__ = []);
      const n = $t.prototype.__modules__;
      typeof e == "function" && n.indexOf(e) < 0 && n.push(e);
    }
    static use(e) {
      return Array.isArray(e)
        ? (e.forEach((n) => $t.installModule(n)), $t)
        : ($t.installModule(e), $t);
    }
  };
  Object.keys(dr).forEach((t) => {
    Object.keys(dr[t]).forEach((e) => {
      fr.prototype[e] = dr[t][e];
    });
  }),
    fr.use([vp, yp]);
  const _a = [
    "eventsPrefix",
    "injectStyles",
    "injectStylesUrls",
    "modules",
    "init",
    "_direction",
    "oneWayMovement",
    "swiperElementNodeName",
    "touchEventsTarget",
    "initialSlide",
    "_speed",
    "cssMode",
    "updateOnWindowResize",
    "resizeObserver",
    "nested",
    "focusableElements",
    "_enabled",
    "_width",
    "_height",
    "preventInteractionOnTransition",
    "userAgent",
    "url",
    "_edgeSwipeDetection",
    "_edgeSwipeThreshold",
    "_freeMode",
    "_autoHeight",
    "setWrapperSize",
    "virtualTranslate",
    "_effect",
    "breakpoints",
    "breakpointsBase",
    "_spaceBetween",
    "_slidesPerView",
    "maxBackfaceHiddenSlides",
    "_grid",
    "_slidesPerGroup",
    "_slidesPerGroupSkip",
    "_slidesPerGroupAuto",
    "_centeredSlides",
    "_centeredSlidesBounds",
    "_slidesOffsetBefore",
    "_slidesOffsetAfter",
    "normalizeSlideIndex",
    "_centerInsufficientSlides",
    "_watchOverflow",
    "roundLengths",
    "touchRatio",
    "touchAngle",
    "simulateTouch",
    "_shortSwipes",
    "_longSwipes",
    "longSwipesRatio",
    "longSwipesMs",
    "_followFinger",
    "allowTouchMove",
    "_threshold",
    "touchMoveStopPropagation",
    "touchStartPreventDefault",
    "touchStartForcePreventDefault",
    "touchReleaseOnEdges",
    "uniqueNavElements",
    "_resistance",
    "_resistanceRatio",
    "_watchSlidesProgress",
    "_grabCursor",
    "preventClicks",
    "preventClicksPropagation",
    "_slideToClickedSlide",
    "_loop",
    "loopAdditionalSlides",
    "loopAddBlankSlides",
    "loopPreventsSliding",
    "_rewind",
    "_allowSlidePrev",
    "_allowSlideNext",
    "_swipeHandler",
    "_noSwiping",
    "noSwipingClass",
    "noSwipingSelector",
    "passiveListeners",
    "containerModifierClass",
    "slideClass",
    "slideActiveClass",
    "slideVisibleClass",
    "slideFullyVisibleClass",
    "slideNextClass",
    "slidePrevClass",
    "slideBlankClass",
    "wrapperClass",
    "lazyPreloaderClass",
    "lazyPreloadPrevNext",
    "runCallbacksOnInit",
    "observer",
    "observeParents",
    "observeSlideChildren",
    "a11y",
    "_autoplay",
    "_controller",
    "coverflowEffect",
    "cubeEffect",
    "fadeEffect",
    "flipEffect",
    "creativeEffect",
    "cardsEffect",
    "hashNavigation",
    "history",
    "keyboard",
    "mousewheel",
    "_navigation",
    "_pagination",
    "parallax",
    "_scrollbar",
    "_thumbs",
    "virtual",
    "zoom",
    "control",
  ];
  function an(t) {
    return (
      typeof t == "object" &&
      t !== null &&
      t.constructor &&
      Object.prototype.toString.call(t).slice(8, -1) === "Object" &&
      !t.__swiper__
    );
  }
  function xn(t, e) {
    const n = ["__proto__", "constructor", "prototype"];
    Object.keys(e)
      .filter((s) => n.indexOf(s) < 0)
      .forEach((s) => {
        typeof t[s] == "undefined"
          ? (t[s] = e[s])
          : an(e[s]) && an(t[s]) && Object.keys(e[s]).length > 0
          ? e[s].__swiper__
            ? (t[s] = e[s])
            : xn(t[s], e[s])
          : (t[s] = e[s]);
      });
  }
  function Sa(t) {
    return (
      t === void 0 && (t = {}),
      t.navigation &&
        typeof t.navigation.nextEl == "undefined" &&
        typeof t.navigation.prevEl == "undefined"
    );
  }
  function Ea(t) {
    return (
      t === void 0 && (t = {}),
      t.pagination && typeof t.pagination.el == "undefined"
    );
  }
  function xa(t) {
    return (
      t === void 0 && (t = {}),
      t.scrollbar && typeof t.scrollbar.el == "undefined"
    );
  }
  function Ta(t) {
    t === void 0 && (t = "");
    const e = t
        .split(" ")
        .map((s) => s.trim())
        .filter((s) => !!s),
      n = [];
    return (
      e.forEach((s) => {
        n.indexOf(s) < 0 && n.push(s);
      }),
      n.join(" ")
    );
  }
  function Eh(t) {
    return (
      t === void 0 && (t = ""),
      t
        ? t.includes("swiper-wrapper")
          ? t
          : `swiper-wrapper ${t}`
        : "swiper-wrapper"
    );
  }
  function xh(t) {
    let {
      swiper: e,
      slides: n,
      passedParams: s,
      changedParams: i,
      nextEl: r,
      prevEl: o,
      scrollbarEl: l,
      paginationEl: a,
    } = t;
    const u = i.filter(
        (T) => T !== "children" && T !== "direction" && T !== "wrapperClass"
      ),
      {
        params: c,
        pagination: d,
        navigation: f,
        scrollbar: p,
        virtual: h,
        thumbs: m,
      } = e;
    let b, w, g, y, E, C, O, z;
    i.includes("thumbs") &&
      s.thumbs &&
      s.thumbs.swiper &&
      !s.thumbs.swiper.destroyed &&
      c.thumbs &&
      (!c.thumbs.swiper || c.thumbs.swiper.destroyed) &&
      (b = !0),
      i.includes("controller") &&
        s.controller &&
        s.controller.control &&
        c.controller &&
        !c.controller.control &&
        (w = !0),
      i.includes("pagination") &&
        s.pagination &&
        (s.pagination.el || a) &&
        (c.pagination || c.pagination === !1) &&
        d &&
        !d.el &&
        (g = !0),
      i.includes("scrollbar") &&
        s.scrollbar &&
        (s.scrollbar.el || l) &&
        (c.scrollbar || c.scrollbar === !1) &&
        p &&
        !p.el &&
        (y = !0),
      i.includes("navigation") &&
        s.navigation &&
        (s.navigation.prevEl || o) &&
        (s.navigation.nextEl || r) &&
        (c.navigation || c.navigation === !1) &&
        f &&
        !f.prevEl &&
        !f.nextEl &&
        (E = !0);
    const N = (T) => {
      e[T] &&
        (e[T].destroy(),
        T === "navigation"
          ? (e.isElement && (e[T].prevEl.remove(), e[T].nextEl.remove()),
            (c[T].prevEl = void 0),
            (c[T].nextEl = void 0),
            (e[T].prevEl = void 0),
            (e[T].nextEl = void 0))
          : (e.isElement && e[T].el.remove(),
            (c[T].el = void 0),
            (e[T].el = void 0)));
    };
    i.includes("loop") &&
      e.isElement &&
      (c.loop && !s.loop ? (C = !0) : !c.loop && s.loop ? (O = !0) : (z = !0)),
      u.forEach((T) => {
        if (an(c[T]) && an(s[T]))
          Object.assign(c[T], s[T]),
            (T === "navigation" || T === "pagination" || T === "scrollbar") &&
              "enabled" in s[T] &&
              !s[T].enabled &&
              N(T);
        else {
          const P = s[T];
          (P === !0 || P === !1) &&
          (T === "navigation" || T === "pagination" || T === "scrollbar")
            ? P === !1 && N(T)
            : (c[T] = s[T]);
        }
      }),
      u.includes("controller") &&
        !w &&
        e.controller &&
        e.controller.control &&
        c.controller &&
        c.controller.control &&
        (e.controller.control = c.controller.control),
      i.includes("children") && n && h && c.virtual.enabled
        ? ((h.slides = n), h.update(!0))
        : i.includes("virtual") &&
          h &&
          c.virtual.enabled &&
          (n && (h.slides = n), h.update(!0)),
      i.includes("children") && n && c.loop && (z = !0),
      b && m.init() && m.update(!0),
      w && (e.controller.control = c.controller.control),
      g &&
        (e.isElement &&
          (!a || typeof a == "string") &&
          ((a = document.createElement("div")),
          a.classList.add("swiper-pagination"),
          a.part.add("pagination"),
          e.el.appendChild(a)),
        a && (c.pagination.el = a),
        d.init(),
        d.render(),
        d.update()),
      y &&
        (e.isElement &&
          (!l || typeof l == "string") &&
          ((l = document.createElement("div")),
          l.classList.add("swiper-scrollbar"),
          l.part.add("scrollbar"),
          e.el.appendChild(l)),
        l && (c.scrollbar.el = l),
        p.init(),
        p.updateSize(),
        p.setTranslate()),
      E &&
        (e.isElement &&
          ((!r || typeof r == "string") &&
            ((r = document.createElement("div")),
            r.classList.add("swiper-button-next"),
            ss(r, e.hostEl.constructor.nextButtonSvg),
            r.part.add("button-next"),
            e.el.appendChild(r)),
          (!o || typeof o == "string") &&
            ((o = document.createElement("div")),
            o.classList.add("swiper-button-prev"),
            ss(o, e.hostEl.constructor.prevButtonSvg),
            o.part.add("button-prev"),
            e.el.appendChild(o))),
        r && (c.navigation.nextEl = r),
        o && (c.navigation.prevEl = o),
        f.init(),
        f.update()),
      i.includes("allowSlideNext") && (e.allowSlideNext = s.allowSlideNext),
      i.includes("allowSlidePrev") && (e.allowSlidePrev = s.allowSlidePrev),
      i.includes("direction") && e.changeDirection(s.direction, !1),
      (C || z) && e.loopDestroy(),
      (O || z) && e.loopCreate(),
      e.update();
  }
  function Ca(t, e) {
    t === void 0 && (t = {});
    const n = { on: {} },
      s = {},
      i = {};
    xn(n, cr), (n._emitClasses = !0), (n.init = !1);
    const r = {},
      o = _a.map((a) => a.replace(/_/, "")),
      l = Object.assign({}, t);
    return (
      Object.keys(l).forEach((a) => {
        typeof t[a] != "undefined" &&
          (o.indexOf(a) >= 0
            ? an(t[a])
              ? ((n[a] = {}), (i[a] = {}), xn(n[a], t[a]), xn(i[a], t[a]))
              : ((n[a] = t[a]), (i[a] = t[a]))
            : a.search(/on[A-Z]/) === 0 && typeof t[a] == "function"
            ? (n.on[`${a[2].toLowerCase()}${a.substr(3)}`] = t[a])
            : (r[a] = t[a]));
      }),
      ["navigation", "pagination", "scrollbar"].forEach((a) => {
        n[a] === !0 && (n[a] = {}), n[a] === !1 && delete n[a];
      }),
      { params: n, passedParams: i, rest: r, events: s }
    );
  }
  function Th(t, e) {
    let {
      el: n,
      nextEl: s,
      prevEl: i,
      paginationEl: r,
      scrollbarEl: o,
      swiper: l,
    } = t;
    Sa(e) &&
      s &&
      i &&
      ((l.params.navigation.nextEl = s),
      (l.originalParams.navigation.nextEl = s),
      (l.params.navigation.prevEl = i),
      (l.originalParams.navigation.prevEl = i)),
      Ea(e) &&
        r &&
        ((l.params.pagination.el = r), (l.originalParams.pagination.el = r)),
      xa(e) &&
        o &&
        ((l.params.scrollbar.el = o), (l.originalParams.scrollbar.el = o)),
      l.init(n);
  }
  function Ch(t, e, n, s, i) {
    const r = [];
    if (!e) return r;
    const o = (a) => {
      r.indexOf(a) < 0 && r.push(a);
    };
    if (n && s) {
      const a = s.map(i),
        u = n.map(i);
      a.join("") !== u.join("") && o("children"),
        s.length !== n.length && o("children");
    }
    return (
      _a
        .filter((a) => a[0] === "_")
        .map((a) => a.replace(/_/, ""))
        .forEach((a) => {
          if (a in t && a in e)
            if (an(t[a]) && an(e[a])) {
              const u = Object.keys(t[a]),
                c = Object.keys(e[a]);
              u.length !== c.length
                ? o(a)
                : (u.forEach((d) => {
                    t[a][d] !== e[a][d] && o(a);
                  }),
                  c.forEach((d) => {
                    t[a][d] !== e[a][d] && o(a);
                  }));
            } else t[a] !== e[a] && o(a);
        }),
      r
    );
  }
  const Ah = (t) => {
    !t ||
      t.destroyed ||
      !t.params.virtual ||
      (t.params.virtual && !t.params.virtual.enabled) ||
      (t.updateSlides(),
      t.updateProgress(),
      t.updateSlidesClasses(),
      t.emit("_virtualUpdated"),
      t.parallax &&
        t.params.parallax &&
        t.params.parallax.enabled &&
        t.parallax.setTranslate());
  };
  function pr(t, e, n) {
    t === void 0 && (t = {});
    const s = [],
      i = {
        "container-start": [],
        "container-end": [],
        "wrapper-start": [],
        "wrapper-end": [],
      },
      r = (o, l) => {
        Array.isArray(o) &&
          o.forEach((a) => {
            const u = typeof a.type == "symbol";
            l === "default" && (l = "container-end"),
              u && a.children
                ? r(a.children, l)
                : (a.type &&
                    (a.type.name === "SwiperSlide" ||
                      a.type.name === "AsyncComponentWrapper")) ||
                  (a.componentOptions &&
                    a.componentOptions.tag === "SwiperSlide")
                ? s.push(a)
                : i[l] && i[l].push(a);
          });
      };
    return (
      Object.keys(t).forEach((o) => {
        if (typeof t[o] != "function") return;
        const l = t[o]();
        r(l, o);
      }),
      (n.value = e.value),
      (e.value = s),
      { slides: s, slots: i }
    );
  }
  function Mh(t, e, n) {
    if (!n) return null;
    const s = (c) => {
        let d = c;
        return (
          c < 0 ? (d = e.length + c) : d >= e.length && (d = d - e.length), d
        );
      },
      i = t.value.isHorizontal()
        ? { [t.value.rtlTranslate ? "right" : "left"]: `${n.offset}px` }
        : { top: `${n.offset}px` },
      { from: r, to: o } = n,
      l = t.value.params.loop ? -e.length : 0,
      a = t.value.params.loop ? e.length * 2 : e.length,
      u = [];
    for (let c = l; c < a; c += 1)
      c >= r && c <= o && u.length < e.length && u.push(e[s(c)]);
    return u.map((c) => {
      if (
        (c.props || (c.props = {}),
        c.props.style || (c.props.style = {}),
        (c.props.swiperRef = t),
        (c.props.style = i),
        c.type)
      )
        return We(c.type, Ie({}, c.props), c.children);
      if (c.componentOptions)
        return We(
          c.componentOptions.Ctor,
          Ie({}, c.props),
          c.componentOptions.children
        );
    });
  }
  const is = {
      name: "Swiper",
      props: {
        tag: { type: String, default: "div" },
        wrapperTag: { type: String, default: "div" },
        modules: { type: Array, default: void 0 },
        init: { type: Boolean, default: void 0 },
        direction: { type: String, default: void 0 },
        oneWayMovement: { type: Boolean, default: void 0 },
        swiperElementNodeName: { type: String, default: "SWIPER-CONTAINER" },
        touchEventsTarget: { type: String, default: void 0 },
        initialSlide: { type: Number, default: void 0 },
        speed: { type: Number, default: void 0 },
        cssMode: { type: Boolean, default: void 0 },
        updateOnWindowResize: { type: Boolean, default: void 0 },
        resizeObserver: { type: Boolean, default: void 0 },
        nested: { type: Boolean, default: void 0 },
        focusableElements: { type: String, default: void 0 },
        width: { type: Number, default: void 0 },
        height: { type: Number, default: void 0 },
        preventInteractionOnTransition: { type: Boolean, default: void 0 },
        userAgent: { type: String, default: void 0 },
        url: { type: String, default: void 0 },
        edgeSwipeDetection: { type: [Boolean, String], default: void 0 },
        edgeSwipeThreshold: { type: Number, default: void 0 },
        autoHeight: { type: Boolean, default: void 0 },
        setWrapperSize: { type: Boolean, default: void 0 },
        virtualTranslate: { type: Boolean, default: void 0 },
        effect: { type: String, default: void 0 },
        breakpoints: { type: Object, default: void 0 },
        breakpointsBase: { type: String, default: void 0 },
        spaceBetween: { type: [Number, String], default: void 0 },
        slidesPerView: { type: [Number, String], default: void 0 },
        maxBackfaceHiddenSlides: { type: Number, default: void 0 },
        slidesPerGroup: { type: Number, default: void 0 },
        slidesPerGroupSkip: { type: Number, default: void 0 },
        slidesPerGroupAuto: { type: Boolean, default: void 0 },
        centeredSlides: { type: Boolean, default: void 0 },
        centeredSlidesBounds: { type: Boolean, default: void 0 },
        slidesOffsetBefore: { type: Number, default: void 0 },
        slidesOffsetAfter: { type: Number, default: void 0 },
        normalizeSlideIndex: { type: Boolean, default: void 0 },
        centerInsufficientSlides: { type: Boolean, default: void 0 },
        watchOverflow: { type: Boolean, default: void 0 },
        roundLengths: { type: Boolean, default: void 0 },
        touchRatio: { type: Number, default: void 0 },
        touchAngle: { type: Number, default: void 0 },
        simulateTouch: { type: Boolean, default: void 0 },
        shortSwipes: { type: Boolean, default: void 0 },
        longSwipes: { type: Boolean, default: void 0 },
        longSwipesRatio: { type: Number, default: void 0 },
        longSwipesMs: { type: Number, default: void 0 },
        followFinger: { type: Boolean, default: void 0 },
        allowTouchMove: { type: Boolean, default: void 0 },
        threshold: { type: Number, default: void 0 },
        touchMoveStopPropagation: { type: Boolean, default: void 0 },
        touchStartPreventDefault: { type: Boolean, default: void 0 },
        touchStartForcePreventDefault: { type: Boolean, default: void 0 },
        touchReleaseOnEdges: { type: Boolean, default: void 0 },
        uniqueNavElements: { type: Boolean, default: void 0 },
        resistance: { type: Boolean, default: void 0 },
        resistanceRatio: { type: Number, default: void 0 },
        watchSlidesProgress: { type: Boolean, default: void 0 },
        grabCursor: { type: Boolean, default: void 0 },
        preventClicks: { type: Boolean, default: void 0 },
        preventClicksPropagation: { type: Boolean, default: void 0 },
        slideToClickedSlide: { type: Boolean, default: void 0 },
        loop: { type: Boolean, default: void 0 },
        loopedSlides: { type: Number, default: void 0 },
        loopPreventsSliding: { type: Boolean, default: void 0 },
        loopAdditionalSlides: { type: Number, default: void 0 },
        loopAddBlankSlides: { type: Boolean, default: void 0 },
        rewind: { type: Boolean, default: void 0 },
        allowSlidePrev: { type: Boolean, default: void 0 },
        allowSlideNext: { type: Boolean, default: void 0 },
        swipeHandler: { type: Boolean, default: void 0 },
        noSwiping: { type: Boolean, default: void 0 },
        noSwipingClass: { type: String, default: void 0 },
        noSwipingSelector: { type: String, default: void 0 },
        passiveListeners: { type: Boolean, default: void 0 },
        containerModifierClass: { type: String, default: void 0 },
        slideClass: { type: String, default: void 0 },
        slideActiveClass: { type: String, default: void 0 },
        slideVisibleClass: { type: String, default: void 0 },
        slideFullyVisibleClass: { type: String, default: void 0 },
        slideBlankClass: { type: String, default: void 0 },
        slideNextClass: { type: String, default: void 0 },
        slidePrevClass: { type: String, default: void 0 },
        wrapperClass: { type: String, default: void 0 },
        lazyPreloaderClass: { type: String, default: void 0 },
        lazyPreloadPrevNext: { type: Number, default: void 0 },
        runCallbacksOnInit: { type: Boolean, default: void 0 },
        observer: { type: Boolean, default: void 0 },
        observeParents: { type: Boolean, default: void 0 },
        observeSlideChildren: { type: Boolean, default: void 0 },
        a11y: { type: [Boolean, Object], default: void 0 },
        autoplay: { type: [Boolean, Object], default: void 0 },
        controller: { type: Object, default: void 0 },
        coverflowEffect: { type: Object, default: void 0 },
        cubeEffect: { type: Object, default: void 0 },
        fadeEffect: { type: Object, default: void 0 },
        flipEffect: { type: Object, default: void 0 },
        creativeEffect: { type: Object, default: void 0 },
        cardsEffect: { type: Object, default: void 0 },
        hashNavigation: { type: [Boolean, Object], default: void 0 },
        history: { type: [Boolean, Object], default: void 0 },
        keyboard: { type: [Boolean, Object], default: void 0 },
        mousewheel: { type: [Boolean, Object], default: void 0 },
        navigation: { type: [Boolean, Object], default: void 0 },
        pagination: { type: [Boolean, Object], default: void 0 },
        parallax: { type: [Boolean, Object], default: void 0 },
        scrollbar: { type: [Boolean, Object], default: void 0 },
        thumbs: { type: Object, default: void 0 },
        virtual: { type: [Boolean, Object], default: void 0 },
        zoom: { type: [Boolean, Object], default: void 0 },
        grid: { type: [Object], default: void 0 },
        freeMode: { type: [Boolean, Object], default: void 0 },
        enabled: { type: Boolean, default: void 0 },
      },
      emits: [
        "_beforeBreakpoint",
        "_containerClasses",
        "_slideClass",
        "_slideClasses",
        "_swiper",
        "_freeModeNoMomentumRelease",
        "_virtualUpdated",
        "activeIndexChange",
        "afterInit",
        "autoplay",
        "autoplayStart",
        "autoplayStop",
        "autoplayPause",
        "autoplayResume",
        "autoplayTimeLeft",
        "beforeDestroy",
        "beforeInit",
        "beforeLoopFix",
        "beforeResize",
        "beforeSlideChangeStart",
        "beforeTransitionStart",
        "breakpoint",
        "changeDirection",
        "click",
        "disable",
        "doubleTap",
        "doubleClick",
        "destroy",
        "enable",
        "fromEdge",
        "hashChange",
        "hashSet",
        "init",
        "keyPress",
        "lock",
        "loopFix",
        "momentumBounce",
        "navigationHide",
        "navigationShow",
        "navigationPrev",
        "navigationNext",
        "observerUpdate",
        "orientationchange",
        "paginationHide",
        "paginationRender",
        "paginationShow",
        "paginationUpdate",
        "progress",
        "reachBeginning",
        "reachEnd",
        "realIndexChange",
        "resize",
        "scroll",
        "scrollbarDragEnd",
        "scrollbarDragMove",
        "scrollbarDragStart",
        "setTransition",
        "setTranslate",
        "slidesUpdated",
        "slideChange",
        "slideChangeTransitionEnd",
        "slideChangeTransitionStart",
        "slideNextTransitionEnd",
        "slideNextTransitionStart",
        "slidePrevTransitionEnd",
        "slidePrevTransitionStart",
        "slideResetTransitionStart",
        "slideResetTransitionEnd",
        "sliderMove",
        "sliderFirstMove",
        "slidesLengthChange",
        "slidesGridLengthChange",
        "snapGridLengthChange",
        "snapIndexChange",
        "swiper",
        "tap",
        "toEdge",
        "touchEnd",
        "touchMove",
        "touchMoveOpposite",
        "touchStart",
        "transitionEnd",
        "transitionStart",
        "unlock",
        "update",
        "virtualUpdate",
        "zoomChange",
      ],
      setup(t, e) {
        let { slots: n, emit: s } = e;
        const { tag: i, wrapperTag: r } = t,
          o = ae("swiper"),
          l = ae(null),
          a = ae(!1),
          u = ae(!1),
          c = ae(null),
          d = ae(null),
          f = ae(null),
          p = { value: [] },
          h = { value: [] },
          m = ae(null),
          b = ae(null),
          w = ae(null),
          g = ae(null),
          { params: y, passedParams: E } = Ca(t);
        pr(n, p, h), (f.value = E), (h.value = p.value);
        const C = () => {
          pr(n, p, h), (a.value = !0);
        };
        (y.onAny = function (N) {
          for (
            var T = arguments.length, P = new Array(T > 1 ? T - 1 : 0), $ = 1;
            $ < T;
            $++
          )
            P[$ - 1] = arguments[$];
          s(N, ...P);
        }),
          Object.assign(y.on, {
            _beforeBreakpoint: C,
            _containerClasses(N, T) {
              o.value = T;
            },
          });
        const O = Ie({}, y);
        if (
          (delete O.wrapperClass,
          (d.value = new fr(O)),
          d.value.virtual && d.value.params.virtual.enabled)
        ) {
          d.value.virtual.slides = p.value;
          const N = {
            cache: !1,
            slides: p.value,
            renderExternal: (T) => {
              l.value = T;
            },
            renderExternalUpdate: !1,
          };
          xn(d.value.params.virtual, N), xn(d.value.originalParams.virtual, N);
        }
        Pi(() => {
          !u.value && d.value && (d.value.emitSlidesClasses(), (u.value = !0));
          const { passedParams: N } = Ca(t),
            T = Ch(N, f.value, p.value, h.value, (P) => P.props && P.props.key);
          (f.value = N),
            (T.length || a.value) &&
              d.value &&
              !d.value.destroyed &&
              xh({
                swiper: d.value,
                slides: p.value,
                passedParams: N,
                changedParams: T,
                nextEl: m.value,
                prevEl: b.value,
                scrollbarEl: g.value,
                paginationEl: w.value,
              }),
            (a.value = !1);
        }),
          wn("swiper", d),
          jt(l, () => {
            Bn(() => {
              Ah(d.value);
            });
          }),
          It(() => {
            c.value &&
              (Th(
                {
                  el: c.value,
                  nextEl: m.value,
                  prevEl: b.value,
                  paginationEl: w.value,
                  scrollbarEl: g.value,
                  swiper: d.value,
                },
                y
              ),
              s("swiper", d.value));
          }),
          Gt(() => {
            d.value && !d.value.destroyed && d.value.destroy(!0, !1);
          });
        function z(N) {
          return y.virtual
            ? Mh(d, N, l.value)
            : (N.forEach((T, P) => {
                T.props || (T.props = {}),
                  (T.props.swiperRef = d),
                  (T.props.swiperSlideIndex = P);
              }),
              N);
        }
        return () => {
          const { slides: N, slots: T } = pr(n, p, h);
          return We(i, { ref: c, class: Ta(o.value) }, [
            T["container-start"],
            We(r, { class: Eh(y.wrapperClass) }, [
              T["wrapper-start"],
              z(N),
              T["wrapper-end"],
            ]),
            Sa(t) && [
              We("div", { ref: b, class: "swiper-button-prev" }),
              We("div", { ref: m, class: "swiper-button-next" }),
            ],
            xa(t) && We("div", { ref: g, class: "swiper-scrollbar" }),
            Ea(t) && We("div", { ref: w, class: "swiper-pagination" }),
            T["container-end"],
          ]);
        };
      },
    },
    rs = {
      name: "SwiperSlide",
      props: {
        tag: { type: String, default: "div" },
        swiperRef: { type: Object, required: !1 },
        swiperSlideIndex: { type: Number, default: void 0, required: !1 },
        zoom: { type: Boolean, default: void 0, required: !1 },
        lazy: { type: Boolean, default: !1, required: !1 },
        virtualIndex: { type: [String, Number], default: void 0 },
      },
      setup(t, e) {
        let { slots: n } = e,
          s = !1;
        const { swiperRef: i } = t,
          r = ae(null),
          o = ae("swiper-slide"),
          l = ae(!1);
        function a(d, f, p) {
          f === r.value && (o.value = p);
        }
        It(() => {
          !i || !i.value || (i.value.on("_slideClass", a), (s = !0));
        }),
          Co(() => {
            s || !i || !i.value || (i.value.on("_slideClass", a), (s = !0));
          }),
          Pi(() => {
            !r.value ||
              !i ||
              !i.value ||
              (typeof t.swiperSlideIndex != "undefined" &&
                (r.value.swiperSlideIndex = t.swiperSlideIndex),
              i.value.destroyed &&
                o.value !== "swiper-slide" &&
                (o.value = "swiper-slide"));
          }),
          Gt(() => {
            !i || !i.value || i.value.off("_slideClass", a);
          });
        const u = ze(() => ({
          isActive: o.value.indexOf("swiper-slide-active") >= 0,
          isVisible: o.value.indexOf("swiper-slide-visible") >= 0,
          isPrev: o.value.indexOf("swiper-slide-prev") >= 0,
          isNext: o.value.indexOf("swiper-slide-next") >= 0,
        }));
        wn("swiperSlide", u);
        const c = () => {
          l.value = !0;
        };
        return () =>
          We(
            t.tag,
            {
              class: Ta(`${o.value}`),
              ref: r,
              "data-swiper-slide-index":
                typeof t.virtualIndex == "undefined" &&
                i &&
                i.value &&
                i.value.params.loop
                  ? t.swiperSlideIndex
                  : t.virtualIndex,
              onLoadCapture: c,
            },
            t.zoom
              ? We(
                  "div",
                  {
                    class: "swiper-zoom-container",
                    "data-swiper-zoom":
                      typeof t.zoom == "number" ? t.zoom : void 0,
                  },
                  [
                    n.default && n.default(u.value),
                    t.lazy &&
                      !l.value &&
                      We("div", { class: "swiper-lazy-preloader" }),
                  ]
                )
              : [
                  n.default && n.default(u.value),
                  t.lazy &&
                    !l.value &&
                    We("div", { class: "swiper-lazy-preloader" }),
                ]
          );
      },
    };
  function Aa(t, e, n, s) {
    return (
      t.params.createElements &&
        Object.keys(s).forEach((i) => {
          if (!n[i] && n.auto === !0) {
            let r = bt(t.el, `.${s[i]}`)[0];
            r || ((r = ts("div", s[i])), (r.className = s[i]), t.el.append(r)),
              (n[i] = r),
              (e[i] = r);
          }
        }),
      n
    );
  }
  function Ph(t) {
    let { swiper: e, extendParams: n, on: s, emit: i } = t;
    n({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: !1,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
        navigationDisabledClass: "swiper-navigation-disabled",
      },
    }),
      (e.navigation = { nextEl: null, prevEl: null });
    function r(h) {
      let m;
      return h &&
        typeof h == "string" &&
        e.isElement &&
        ((m = e.el.querySelector(h) || e.hostEl.querySelector(h)), m)
        ? m
        : (h &&
            (typeof h == "string" && (m = [...document.querySelectorAll(h)]),
            e.params.uniqueNavElements &&
            typeof h == "string" &&
            m &&
            m.length > 1 &&
            e.el.querySelectorAll(h).length === 1
              ? (m = e.el.querySelector(h))
              : m && m.length === 1 && (m = m[0])),
          h && !m ? h : m);
    }
    function o(h, m) {
      const b = e.params.navigation;
      (h = ue(h)),
        h.forEach((w) => {
          w &&
            (w.classList[m ? "add" : "remove"](...b.disabledClass.split(" ")),
            w.tagName === "BUTTON" && (w.disabled = m),
            e.params.watchOverflow &&
              e.enabled &&
              w.classList[e.isLocked ? "add" : "remove"](b.lockClass));
        });
    }
    function l() {
      const { nextEl: h, prevEl: m } = e.navigation;
      if (e.params.loop) {
        o(m, !1), o(h, !1);
        return;
      }
      o(m, e.isBeginning && !e.params.rewind),
        o(h, e.isEnd && !e.params.rewind);
    }
    function a(h) {
      h.preventDefault(),
        !(e.isBeginning && !e.params.loop && !e.params.rewind) &&
          (e.slidePrev(), i("navigationPrev"));
    }
    function u(h) {
      h.preventDefault(),
        !(e.isEnd && !e.params.loop && !e.params.rewind) &&
          (e.slideNext(), i("navigationNext"));
    }
    function c() {
      const h = e.params.navigation;
      if (
        ((e.params.navigation = Aa(
          e,
          e.originalParams.navigation,
          e.params.navigation,
          { nextEl: "swiper-button-next", prevEl: "swiper-button-prev" }
        )),
        !(h.nextEl || h.prevEl))
      )
        return;
      let m = r(h.nextEl),
        b = r(h.prevEl);
      Object.assign(e.navigation, { nextEl: m, prevEl: b }),
        (m = ue(m)),
        (b = ue(b));
      const w = (g, y) => {
        g && g.addEventListener("click", y === "next" ? u : a),
          !e.enabled && g && g.classList.add(...h.lockClass.split(" "));
      };
      m.forEach((g) => w(g, "next")), b.forEach((g) => w(g, "prev"));
    }
    function d() {
      let { nextEl: h, prevEl: m } = e.navigation;
      (h = ue(h)), (m = ue(m));
      const b = (w, g) => {
        w.removeEventListener("click", g === "next" ? u : a),
          w.classList.remove(...e.params.navigation.disabledClass.split(" "));
      };
      h.forEach((w) => b(w, "next")), m.forEach((w) => b(w, "prev"));
    }
    s("init", () => {
      e.params.navigation.enabled === !1 ? p() : (c(), l());
    }),
      s("toEdge fromEdge lock unlock", () => {
        l();
      }),
      s("destroy", () => {
        d();
      }),
      s("enable disable", () => {
        let { nextEl: h, prevEl: m } = e.navigation;
        if (((h = ue(h)), (m = ue(m)), e.enabled)) {
          l();
          return;
        }
        [...h, ...m]
          .filter((b) => !!b)
          .forEach((b) => b.classList.add(e.params.navigation.lockClass));
      }),
      s("click", (h, m) => {
        let { nextEl: b, prevEl: w } = e.navigation;
        (b = ue(b)), (w = ue(w));
        const g = m.target;
        let y = w.includes(g) || b.includes(g);
        if (e.isElement && !y) {
          const E = m.path || (m.composedPath && m.composedPath());
          E && (y = E.find((C) => b.includes(C) || w.includes(C)));
        }
        if (e.params.navigation.hideOnClick && !y) {
          if (
            e.pagination &&
            e.params.pagination &&
            e.params.pagination.clickable &&
            (e.pagination.el === g || e.pagination.el.contains(g))
          )
            return;
          let E;
          b.length
            ? (E = b[0].classList.contains(e.params.navigation.hiddenClass))
            : w.length &&
              (E = w[0].classList.contains(e.params.navigation.hiddenClass)),
            i(E === !0 ? "navigationShow" : "navigationHide"),
            [...b, ...w]
              .filter((C) => !!C)
              .forEach((C) =>
                C.classList.toggle(e.params.navigation.hiddenClass)
              );
        }
      });
    const f = () => {
        e.el.classList.remove(
          ...e.params.navigation.navigationDisabledClass.split(" ")
        ),
          c(),
          l();
      },
      p = () => {
        e.el.classList.add(
          ...e.params.navigation.navigationDisabledClass.split(" ")
        ),
          d();
      };
    Object.assign(e.navigation, {
      enable: f,
      disable: p,
      update: l,
      init: c,
      destroy: d,
    });
  }
  function Xt(t) {
    return (
      t === void 0 && (t = ""),
      `.${t
        .trim()
        .replace(/([\.:!+\/()[\]])/g, "\\$1")
        .replace(/ /g, ".")}`
    );
  }
  function Ys(t) {
    let { swiper: e, extendParams: n, on: s, emit: i } = t;
    const r = "swiper-pagination";
    n({
      pagination: {
        el: null,
        bulletElement: "span",
        clickable: !1,
        hideOnClick: !1,
        renderBullet: null,
        renderProgressbar: null,
        renderFraction: null,
        renderCustom: null,
        progressbarOpposite: !1,
        type: "bullets",
        dynamicBullets: !1,
        dynamicMainBullets: 1,
        formatFractionCurrent: (g) => g,
        formatFractionTotal: (g) => g,
        bulletClass: `${r}-bullet`,
        bulletActiveClass: `${r}-bullet-active`,
        modifierClass: `${r}-`,
        currentClass: `${r}-current`,
        totalClass: `${r}-total`,
        hiddenClass: `${r}-hidden`,
        progressbarFillClass: `${r}-progressbar-fill`,
        progressbarOppositeClass: `${r}-progressbar-opposite`,
        clickableClass: `${r}-clickable`,
        lockClass: `${r}-lock`,
        horizontalClass: `${r}-horizontal`,
        verticalClass: `${r}-vertical`,
        paginationDisabledClass: `${r}-disabled`,
      },
    }),
      (e.pagination = { el: null, bullets: [] });
    let o,
      l = 0;
    function a() {
      return (
        !e.params.pagination.el ||
        !e.pagination.el ||
        (Array.isArray(e.pagination.el) && e.pagination.el.length === 0)
      );
    }
    function u(g, y) {
      const { bulletActiveClass: E } = e.params.pagination;
      g &&
        ((g = g[`${y === "prev" ? "previous" : "next"}ElementSibling`]),
        g &&
          (g.classList.add(`${E}-${y}`),
          (g = g[`${y === "prev" ? "previous" : "next"}ElementSibling`]),
          g && g.classList.add(`${E}-${y}-${y}`)));
    }
    function c(g, y, E) {
      if (((g = g % E), (y = y % E), y === g + 1)) return "next";
      if (y === g - 1) return "previous";
    }
    function d(g) {
      const y = g.target.closest(Xt(e.params.pagination.bulletClass));
      if (!y) return;
      g.preventDefault();
      const E = ns(y) * e.params.slidesPerGroup;
      if (e.params.loop) {
        if (e.realIndex === E) return;
        const C = c(e.realIndex, E, e.slides.length);
        C === "next"
          ? e.slideNext()
          : C === "previous"
          ? e.slidePrev()
          : e.slideToLoop(E);
      } else e.slideTo(E);
    }
    function f() {
      const g = e.rtl,
        y = e.params.pagination;
      if (a()) return;
      let E = e.pagination.el;
      E = ue(E);
      let C, O;
      const z =
          e.virtual && e.params.virtual.enabled
            ? e.virtual.slides.length
            : e.slides.length,
        N = e.params.loop
          ? Math.ceil(z / e.params.slidesPerGroup)
          : e.snapGrid.length;
      if (
        (e.params.loop
          ? ((O = e.previousRealIndex || 0),
            (C =
              e.params.slidesPerGroup > 1
                ? Math.floor(e.realIndex / e.params.slidesPerGroup)
                : e.realIndex))
          : typeof e.snapIndex != "undefined"
          ? ((C = e.snapIndex), (O = e.previousSnapIndex))
          : ((O = e.previousIndex || 0), (C = e.activeIndex || 0)),
        y.type === "bullets" &&
          e.pagination.bullets &&
          e.pagination.bullets.length > 0)
      ) {
        const T = e.pagination.bullets;
        let P, $, R;
        if (
          (y.dynamicBullets &&
            ((o = nr(T[0], e.isHorizontal() ? "width" : "height")),
            E.forEach((G) => {
              G.style[e.isHorizontal() ? "width" : "height"] = `${
                o * (y.dynamicMainBullets + 4)
              }px`;
            }),
            y.dynamicMainBullets > 1 &&
              O !== void 0 &&
              ((l += C - (O || 0)),
              l > y.dynamicMainBullets - 1
                ? (l = y.dynamicMainBullets - 1)
                : l < 0 && (l = 0)),
            (P = Math.max(C - l, 0)),
            ($ = P + (Math.min(T.length, y.dynamicMainBullets) - 1)),
            (R = ($ + P) / 2)),
          T.forEach((G) => {
            const ee = [
              ...[
                "",
                "-next",
                "-next-next",
                "-prev",
                "-prev-prev",
                "-main",
              ].map((re) => `${y.bulletActiveClass}${re}`),
            ]
              .map((re) =>
                typeof re == "string" && re.includes(" ") ? re.split(" ") : re
              )
              .flat();
            G.classList.remove(...ee);
          }),
          E.length > 1)
        )
          T.forEach((G) => {
            const ee = ns(G);
            ee === C
              ? G.classList.add(...y.bulletActiveClass.split(" "))
              : e.isElement && G.setAttribute("part", "bullet"),
              y.dynamicBullets &&
                (ee >= P &&
                  ee <= $ &&
                  G.classList.add(...`${y.bulletActiveClass}-main`.split(" ")),
                ee === P && u(G, "prev"),
                ee === $ && u(G, "next"));
          });
        else {
          const G = T[C];
          if (
            (G && G.classList.add(...y.bulletActiveClass.split(" ")),
            e.isElement &&
              T.forEach((ee, re) => {
                ee.setAttribute("part", re === C ? "bullet-active" : "bullet");
              }),
            y.dynamicBullets)
          ) {
            const ee = T[P],
              re = T[$];
            for (let W = P; W <= $; W += 1)
              T[W] &&
                T[W].classList.add(...`${y.bulletActiveClass}-main`.split(" "));
            u(ee, "prev"), u(re, "next");
          }
        }
        if (y.dynamicBullets) {
          const G = Math.min(T.length, y.dynamicMainBullets + 4),
            ee = (o * G - o) / 2 - R * o,
            re = g ? "right" : "left";
          T.forEach((W) => {
            W.style[e.isHorizontal() ? re : "top"] = `${ee}px`;
          });
        }
      }
      E.forEach((T, P) => {
        if (
          (y.type === "fraction" &&
            (T.querySelectorAll(Xt(y.currentClass)).forEach(($) => {
              $.textContent = y.formatFractionCurrent(C + 1);
            }),
            T.querySelectorAll(Xt(y.totalClass)).forEach(($) => {
              $.textContent = y.formatFractionTotal(N);
            })),
          y.type === "progressbar")
        ) {
          let $;
          y.progressbarOpposite
            ? ($ = e.isHorizontal() ? "vertical" : "horizontal")
            : ($ = e.isHorizontal() ? "horizontal" : "vertical");
          const R = (C + 1) / N;
          let G = 1,
            ee = 1;
          $ === "horizontal" ? (G = R) : (ee = R),
            T.querySelectorAll(Xt(y.progressbarFillClass)).forEach((re) => {
              (re.style.transform = `translate3d(0,0,0) scaleX(${G}) scaleY(${ee})`),
                (re.style.transitionDuration = `${e.params.speed}ms`);
            });
        }
        y.type === "custom" && y.renderCustom
          ? (ss(T, y.renderCustom(e, C + 1, N)),
            P === 0 && i("paginationRender", T))
          : (P === 0 && i("paginationRender", T), i("paginationUpdate", T)),
          e.params.watchOverflow &&
            e.enabled &&
            T.classList[e.isLocked ? "add" : "remove"](y.lockClass);
      });
    }
    function p() {
      const g = e.params.pagination;
      if (a()) return;
      const y =
        e.virtual && e.params.virtual.enabled
          ? e.virtual.slides.length
          : e.grid && e.params.grid.rows > 1
          ? e.slides.length / Math.ceil(e.params.grid.rows)
          : e.slides.length;
      let E = e.pagination.el;
      E = ue(E);
      let C = "";
      if (g.type === "bullets") {
        let O = e.params.loop
          ? Math.ceil(y / e.params.slidesPerGroup)
          : e.snapGrid.length;
        e.params.freeMode && e.params.freeMode.enabled && O > y && (O = y);
        for (let z = 0; z < O; z += 1)
          g.renderBullet
            ? (C += g.renderBullet.call(e, z, g.bulletClass))
            : (C += `<${g.bulletElement} ${
                e.isElement ? 'part="bullet"' : ""
              } class="${g.bulletClass}"></${g.bulletElement}>`);
      }
      g.type === "fraction" &&
        (g.renderFraction
          ? (C = g.renderFraction.call(e, g.currentClass, g.totalClass))
          : (C = `<span class="${g.currentClass}"></span> / <span class="${g.totalClass}"></span>`)),
        g.type === "progressbar" &&
          (g.renderProgressbar
            ? (C = g.renderProgressbar.call(e, g.progressbarFillClass))
            : (C = `<span class="${g.progressbarFillClass}"></span>`)),
        (e.pagination.bullets = []),
        E.forEach((O) => {
          g.type !== "custom" && ss(O, C || ""),
            g.type === "bullets" &&
              e.pagination.bullets.push(
                ...O.querySelectorAll(Xt(g.bulletClass))
              );
        }),
        g.type !== "custom" && i("paginationRender", E[0]);
    }
    function h() {
      e.params.pagination = Aa(
        e,
        e.originalParams.pagination,
        e.params.pagination,
        { el: "swiper-pagination" }
      );
      const g = e.params.pagination;
      if (!g.el) return;
      let y;
      typeof g.el == "string" && e.isElement && (y = e.el.querySelector(g.el)),
        !y &&
          typeof g.el == "string" &&
          (y = [...document.querySelectorAll(g.el)]),
        y || (y = g.el),
        !(!y || y.length === 0) &&
          (e.params.uniqueNavElements &&
            typeof g.el == "string" &&
            Array.isArray(y) &&
            y.length > 1 &&
            ((y = [...e.el.querySelectorAll(g.el)]),
            y.length > 1 && (y = y.find((E) => ua(E, ".swiper")[0] === e.el))),
          Array.isArray(y) && y.length === 1 && (y = y[0]),
          Object.assign(e.pagination, { el: y }),
          (y = ue(y)),
          y.forEach((E) => {
            g.type === "bullets" &&
              g.clickable &&
              E.classList.add(...(g.clickableClass || "").split(" ")),
              E.classList.add(g.modifierClass + g.type),
              E.classList.add(
                e.isHorizontal() ? g.horizontalClass : g.verticalClass
              ),
              g.type === "bullets" &&
                g.dynamicBullets &&
                (E.classList.add(`${g.modifierClass}${g.type}-dynamic`),
                (l = 0),
                g.dynamicMainBullets < 1 && (g.dynamicMainBullets = 1)),
              g.type === "progressbar" &&
                g.progressbarOpposite &&
                E.classList.add(g.progressbarOppositeClass),
              g.clickable && E.addEventListener("click", d),
              e.enabled || E.classList.add(g.lockClass);
          }));
    }
    function m() {
      const g = e.params.pagination;
      if (a()) return;
      let y = e.pagination.el;
      y &&
        ((y = ue(y)),
        y.forEach((E) => {
          E.classList.remove(g.hiddenClass),
            E.classList.remove(g.modifierClass + g.type),
            E.classList.remove(
              e.isHorizontal() ? g.horizontalClass : g.verticalClass
            ),
            g.clickable &&
              (E.classList.remove(...(g.clickableClass || "").split(" ")),
              E.removeEventListener("click", d));
        })),
        e.pagination.bullets &&
          e.pagination.bullets.forEach((E) =>
            E.classList.remove(...g.bulletActiveClass.split(" "))
          );
    }
    s("changeDirection", () => {
      if (!e.pagination || !e.pagination.el) return;
      const g = e.params.pagination;
      let { el: y } = e.pagination;
      (y = ue(y)),
        y.forEach((E) => {
          E.classList.remove(g.horizontalClass, g.verticalClass),
            E.classList.add(
              e.isHorizontal() ? g.horizontalClass : g.verticalClass
            );
        });
    }),
      s("init", () => {
        e.params.pagination.enabled === !1 ? w() : (h(), p(), f());
      }),
      s("activeIndexChange", () => {
        typeof e.snapIndex == "undefined" && f();
      }),
      s("snapIndexChange", () => {
        f();
      }),
      s("snapGridLengthChange", () => {
        p(), f();
      }),
      s("destroy", () => {
        m();
      }),
      s("enable disable", () => {
        let { el: g } = e.pagination;
        g &&
          ((g = ue(g)),
          g.forEach((y) =>
            y.classList[e.enabled ? "remove" : "add"](
              e.params.pagination.lockClass
            )
          ));
      }),
      s("lock unlock", () => {
        f();
      }),
      s("click", (g, y) => {
        const E = y.target,
          C = ue(e.pagination.el);
        if (
          e.params.pagination.el &&
          e.params.pagination.hideOnClick &&
          C &&
          C.length > 0 &&
          !E.classList.contains(e.params.pagination.bulletClass)
        ) {
          if (
            e.navigation &&
            ((e.navigation.nextEl && E === e.navigation.nextEl) ||
              (e.navigation.prevEl && E === e.navigation.prevEl))
          )
            return;
          const O = C[0].classList.contains(e.params.pagination.hiddenClass);
          i(O === !0 ? "paginationShow" : "paginationHide"),
            C.forEach((z) =>
              z.classList.toggle(e.params.pagination.hiddenClass)
            );
        }
      });
    const b = () => {
        e.el.classList.remove(e.params.pagination.paginationDisabledClass);
        let { el: g } = e.pagination;
        g &&
          ((g = ue(g)),
          g.forEach((y) =>
            y.classList.remove(e.params.pagination.paginationDisabledClass)
          )),
          h(),
          p(),
          f();
      },
      w = () => {
        e.el.classList.add(e.params.pagination.paginationDisabledClass);
        let { el: g } = e.pagination;
        g &&
          ((g = ue(g)),
          g.forEach((y) =>
            y.classList.add(e.params.pagination.paginationDisabledClass)
          )),
          m();
      };
    Object.assign(e.pagination, {
      enable: b,
      disable: w,
      render: p,
      update: f,
      init: h,
      destroy: m,
    });
  }
  function Lh(t) {
    let { swiper: e, extendParams: n, on: s } = t;
    n({
      a11y: {
        enabled: !0,
        notificationClass: "swiper-notification",
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
        paginationBulletMessage: "Go to slide {{index}}",
        slideLabelMessage: "{{index}} / {{slidesLength}}",
        containerMessage: null,
        containerRoleDescriptionMessage: null,
        containerRole: null,
        itemRoleDescriptionMessage: null,
        slideRole: "group",
        id: null,
        scrollOnFocus: !0,
      },
    }),
      (e.a11y = { clicked: !1 });
    let i = null,
      r,
      o,
      l = new Date().getTime();
    function a(A) {
      const M = i;
      M.length !== 0 && ss(M, A);
    }
    function u(A) {
      const M = () => Math.round(16 * Math.random()).toString(16);
      return "x".repeat(A).replace(/x/g, M);
    }
    function c(A) {
      (A = ue(A)),
        A.forEach((M) => {
          M.setAttribute("tabIndex", "0");
        });
    }
    function d(A) {
      (A = ue(A)),
        A.forEach((M) => {
          M.setAttribute("tabIndex", "-1");
        });
    }
    function f(A, M) {
      (A = ue(A)),
        A.forEach((Y) => {
          Y.setAttribute("role", M);
        });
    }
    function p(A, M) {
      (A = ue(A)),
        A.forEach((Y) => {
          Y.setAttribute("aria-roledescription", M);
        });
    }
    function h(A, M) {
      (A = ue(A)),
        A.forEach((Y) => {
          Y.setAttribute("aria-controls", M);
        });
    }
    function m(A, M) {
      (A = ue(A)),
        A.forEach((Y) => {
          Y.setAttribute("aria-label", M);
        });
    }
    function b(A, M) {
      (A = ue(A)),
        A.forEach((Y) => {
          Y.setAttribute("id", M);
        });
    }
    function w(A, M) {
      (A = ue(A)),
        A.forEach((Y) => {
          Y.setAttribute("aria-live", M);
        });
    }
    function g(A) {
      (A = ue(A)),
        A.forEach((M) => {
          M.setAttribute("aria-disabled", !0);
        });
    }
    function y(A) {
      (A = ue(A)),
        A.forEach((M) => {
          M.setAttribute("aria-disabled", !1);
        });
    }
    function E(A) {
      if (A.keyCode !== 13 && A.keyCode !== 32) return;
      const M = e.params.a11y,
        Y = A.target;
      if (
        !(
          e.pagination &&
          e.pagination.el &&
          (Y === e.pagination.el || e.pagination.el.contains(A.target)) &&
          !A.target.matches(Xt(e.params.pagination.bulletClass))
        )
      ) {
        if (e.navigation && e.navigation.prevEl && e.navigation.nextEl) {
          const le = ue(e.navigation.prevEl);
          ue(e.navigation.nextEl).includes(Y) &&
            ((e.isEnd && !e.params.loop) || e.slideNext(),
            e.isEnd ? a(M.lastSlideMessage) : a(M.nextSlideMessage)),
            le.includes(Y) &&
              ((e.isBeginning && !e.params.loop) || e.slidePrev(),
              e.isBeginning ? a(M.firstSlideMessage) : a(M.prevSlideMessage));
        }
        e.pagination &&
          Y.matches(Xt(e.params.pagination.bulletClass)) &&
          Y.click();
      }
    }
    function C() {
      if (e.params.loop || e.params.rewind || !e.navigation) return;
      const { nextEl: A, prevEl: M } = e.navigation;
      M && (e.isBeginning ? (g(M), d(M)) : (y(M), c(M))),
        A && (e.isEnd ? (g(A), d(A)) : (y(A), c(A)));
    }
    function O() {
      return (
        e.pagination && e.pagination.bullets && e.pagination.bullets.length
      );
    }
    function z() {
      return O() && e.params.pagination.clickable;
    }
    function N() {
      const A = e.params.a11y;
      O() &&
        e.pagination.bullets.forEach((M) => {
          e.params.pagination.clickable &&
            (c(M),
            e.params.pagination.renderBullet ||
              (f(M, "button"),
              m(
                M,
                A.paginationBulletMessage.replace(/\{\{index\}\}/, ns(M) + 1)
              ))),
            M.matches(Xt(e.params.pagination.bulletActiveClass))
              ? M.setAttribute("aria-current", "true")
              : M.removeAttribute("aria-current");
        });
    }
    const T = (A, M, Y) => {
        c(A),
          A.tagName !== "BUTTON" &&
            (f(A, "button"), A.addEventListener("keydown", E)),
          m(A, Y),
          h(A, M);
      },
      P = (A) => {
        o && o !== A.target && !o.contains(A.target) && (r = !0),
          (e.a11y.clicked = !0);
      },
      $ = () => {
        (r = !1),
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              e.destroyed || (e.a11y.clicked = !1);
            });
          });
      },
      R = (A) => {
        l = new Date().getTime();
      },
      G = (A) => {
        if (
          e.a11y.clicked ||
          !e.params.a11y.scrollOnFocus ||
          new Date().getTime() - l < 100
        )
          return;
        const M = A.target.closest(`.${e.params.slideClass}, swiper-slide`);
        if (!M || !e.slides.includes(M)) return;
        o = M;
        const Y = e.slides.indexOf(M) === e.activeIndex,
          le =
            e.params.watchSlidesProgress &&
            e.visibleSlides &&
            e.visibleSlides.includes(M);
        Y ||
          le ||
          (A.sourceCapabilities && A.sourceCapabilities.firesTouchEvents) ||
          (e.isHorizontal() ? (e.el.scrollLeft = 0) : (e.el.scrollTop = 0),
          requestAnimationFrame(() => {
            r ||
              (e.params.loop
                ? e.slideToLoop(
                    e.getSlideIndexWhenGrid(
                      parseInt(M.getAttribute("data-swiper-slide-index"))
                    ),
                    0
                  )
                : e.slideTo(e.getSlideIndexWhenGrid(e.slides.indexOf(M)), 0),
              (r = !1));
          }));
      },
      ee = () => {
        const A = e.params.a11y;
        A.itemRoleDescriptionMessage &&
          p(e.slides, A.itemRoleDescriptionMessage),
          A.slideRole && f(e.slides, A.slideRole);
        const M = e.slides.length;
        A.slideLabelMessage &&
          e.slides.forEach((Y, le) => {
            const Ce = e.params.loop
                ? parseInt(Y.getAttribute("data-swiper-slide-index"), 10)
                : le,
              Ee = A.slideLabelMessage
                .replace(/\{\{index\}\}/, Ce + 1)
                .replace(/\{\{slidesLength\}\}/, M);
            m(Y, Ee);
          });
      },
      re = () => {
        const A = e.params.a11y;
        e.el.append(i);
        const M = e.el;
        A.containerRoleDescriptionMessage &&
          p(M, A.containerRoleDescriptionMessage),
          A.containerMessage && m(M, A.containerMessage),
          A.containerRole && f(M, A.containerRole);
        const Y = e.wrapperEl,
          le = A.id || Y.getAttribute("id") || `swiper-wrapper-${u(16)}`,
          Ce =
            e.params.autoplay && e.params.autoplay.enabled ? "off" : "polite";
        b(Y, le), w(Y, Ce), ee();
        let { nextEl: Ee, prevEl: ft } = e.navigation ? e.navigation : {};
        (Ee = ue(Ee)),
          (ft = ue(ft)),
          Ee && Ee.forEach((Bt) => T(Bt, le, A.nextSlideMessage)),
          ft && ft.forEach((Bt) => T(Bt, le, A.prevSlideMessage)),
          z() &&
            ue(e.pagination.el).forEach((Qe) => {
              Qe.addEventListener("keydown", E);
            }),
          ot().addEventListener("visibilitychange", R),
          e.el.addEventListener("focus", G, !0),
          e.el.addEventListener("focus", G, !0),
          e.el.addEventListener("pointerdown", P, !0),
          e.el.addEventListener("pointerup", $, !0);
      };
    function W() {
      i && i.remove();
      let { nextEl: A, prevEl: M } = e.navigation ? e.navigation : {};
      (A = ue(A)),
        (M = ue(M)),
        A && A.forEach((le) => le.removeEventListener("keydown", E)),
        M && M.forEach((le) => le.removeEventListener("keydown", E)),
        z() &&
          ue(e.pagination.el).forEach((Ce) => {
            Ce.removeEventListener("keydown", E);
          }),
        ot().removeEventListener("visibilitychange", R),
        e.el &&
          typeof e.el != "string" &&
          (e.el.removeEventListener("focus", G, !0),
          e.el.removeEventListener("pointerdown", P, !0),
          e.el.removeEventListener("pointerup", $, !0));
    }
    s("beforeInit", () => {
      (i = ts("span", e.params.a11y.notificationClass)),
        i.setAttribute("aria-live", "assertive"),
        i.setAttribute("aria-atomic", "true");
    }),
      s("afterInit", () => {
        e.params.a11y.enabled && re();
      }),
      s(
        "slidesLengthChange snapGridLengthChange slidesGridLengthChange",
        () => {
          e.params.a11y.enabled && ee();
        }
      ),
      s("fromEdge toEdge afterInit lock unlock", () => {
        e.params.a11y.enabled && C();
      }),
      s("paginationUpdate", () => {
        e.params.a11y.enabled && N();
      }),
      s("destroy", () => {
        e.params.a11y.enabled && W();
      });
  }
  function hr(t) {
    let { swiper: e, extendParams: n, on: s, emit: i, params: r } = t;
    (e.autoplay = { running: !1, paused: !1, timeLeft: 0 }),
      n({
        autoplay: {
          enabled: !1,
          delay: 3e3,
          waitForTransition: !0,
          disableOnInteraction: !1,
          stopOnLastSlide: !1,
          reverseDirection: !1,
          pauseOnMouseEnter: !1,
        },
      });
    let o,
      l,
      a = r && r.autoplay ? r.autoplay.delay : 3e3,
      u = r && r.autoplay ? r.autoplay.delay : 3e3,
      c,
      d = new Date().getTime(),
      f,
      p,
      h,
      m,
      b,
      w,
      g;
    function y(M) {
      !e ||
        e.destroyed ||
        !e.wrapperEl ||
        (M.target === e.wrapperEl &&
          (e.wrapperEl.removeEventListener("transitionend", y),
          !(g || (M.detail && M.detail.bySwiperTouchMove)) && P()));
    }
    const E = () => {
        if (e.destroyed || !e.autoplay.running) return;
        e.autoplay.paused ? (f = !0) : f && ((u = c), (f = !1));
        const M = e.autoplay.paused ? c : d + u - new Date().getTime();
        (e.autoplay.timeLeft = M),
          i("autoplayTimeLeft", M, M / a),
          (l = requestAnimationFrame(() => {
            E();
          }));
      },
      C = () => {
        let M;
        return (
          e.virtual && e.params.virtual.enabled
            ? (M = e.slides.find((le) =>
                le.classList.contains("swiper-slide-active")
              ))
            : (M = e.slides[e.activeIndex]),
          M ? parseInt(M.getAttribute("data-swiper-autoplay"), 10) : void 0
        );
      },
      O = (M) => {
        if (e.destroyed || !e.autoplay.running) return;
        cancelAnimationFrame(l), E();
        let Y = typeof M == "undefined" ? e.params.autoplay.delay : M;
        (a = e.params.autoplay.delay), (u = e.params.autoplay.delay);
        const le = C();
        !Number.isNaN(le) &&
          le > 0 &&
          typeof M == "undefined" &&
          ((Y = le), (a = le), (u = le)),
          (c = Y);
        const Ce = e.params.speed,
          Ee = () => {
            !e ||
              e.destroyed ||
              (e.params.autoplay.reverseDirection
                ? !e.isBeginning || e.params.loop || e.params.rewind
                  ? (e.slidePrev(Ce, !0, !0), i("autoplay"))
                  : e.params.autoplay.stopOnLastSlide ||
                    (e.slideTo(e.slides.length - 1, Ce, !0, !0), i("autoplay"))
                : !e.isEnd || e.params.loop || e.params.rewind
                ? (e.slideNext(Ce, !0, !0), i("autoplay"))
                : e.params.autoplay.stopOnLastSlide ||
                  (e.slideTo(0, Ce, !0, !0), i("autoplay")),
              e.params.cssMode &&
                ((d = new Date().getTime()),
                requestAnimationFrame(() => {
                  O();
                })));
          };
        return (
          Y > 0
            ? (clearTimeout(o),
              (o = setTimeout(() => {
                Ee();
              }, Y)))
            : requestAnimationFrame(() => {
                Ee();
              }),
          Y
        );
      },
      z = () => {
        (d = new Date().getTime()),
          (e.autoplay.running = !0),
          O(),
          i("autoplayStart");
      },
      N = () => {
        (e.autoplay.running = !1),
          clearTimeout(o),
          cancelAnimationFrame(l),
          i("autoplayStop");
      },
      T = (M, Y) => {
        if (e.destroyed || !e.autoplay.running) return;
        clearTimeout(o), M || (w = !0);
        const le = () => {
          i("autoplayPause"),
            e.params.autoplay.waitForTransition
              ? e.wrapperEl.addEventListener("transitionend", y)
              : P();
        };
        if (((e.autoplay.paused = !0), Y)) {
          b && (c = e.params.autoplay.delay), (b = !1), le();
          return;
        }
        (c = (c || e.params.autoplay.delay) - (new Date().getTime() - d)),
          !(e.isEnd && c < 0 && !e.params.loop) && (c < 0 && (c = 0), le());
      },
      P = () => {
        (e.isEnd && c < 0 && !e.params.loop) ||
          e.destroyed ||
          !e.autoplay.running ||
          ((d = new Date().getTime()),
          w ? ((w = !1), O(c)) : O(),
          (e.autoplay.paused = !1),
          i("autoplayResume"));
      },
      $ = () => {
        if (e.destroyed || !e.autoplay.running) return;
        const M = ot();
        M.visibilityState === "hidden" && ((w = !0), T(!0)),
          M.visibilityState === "visible" && P();
      },
      R = (M) => {
        M.pointerType === "mouse" &&
          ((w = !0), (g = !0), !(e.animating || e.autoplay.paused) && T(!0));
      },
      G = (M) => {
        M.pointerType === "mouse" && ((g = !1), e.autoplay.paused && P());
      },
      ee = () => {
        e.params.autoplay.pauseOnMouseEnter &&
          (e.el.addEventListener("pointerenter", R),
          e.el.addEventListener("pointerleave", G));
      },
      re = () => {
        e.el &&
          typeof e.el != "string" &&
          (e.el.removeEventListener("pointerenter", R),
          e.el.removeEventListener("pointerleave", G));
      },
      W = () => {
        ot().addEventListener("visibilitychange", $);
      },
      A = () => {
        ot().removeEventListener("visibilitychange", $);
      };
    s("init", () => {
      e.params.autoplay.enabled && (ee(), W(), z());
    }),
      s("destroy", () => {
        re(), A(), e.autoplay.running && N();
      }),
      s("_freeModeStaticRelease", () => {
        (h || w) && P();
      }),
      s("_freeModeNoMomentumRelease", () => {
        e.params.autoplay.disableOnInteraction ? N() : T(!0, !0);
      }),
      s("beforeTransitionStart", (M, Y, le) => {
        e.destroyed ||
          !e.autoplay.running ||
          (le || !e.params.autoplay.disableOnInteraction ? T(!0, !0) : N());
      }),
      s("sliderFirstMove", () => {
        if (!(e.destroyed || !e.autoplay.running)) {
          if (e.params.autoplay.disableOnInteraction) {
            N();
            return;
          }
          (p = !0),
            (h = !1),
            (w = !1),
            (m = setTimeout(() => {
              (w = !0), (h = !0), T(!0);
            }, 200));
        }
      }),
      s("touchEnd", () => {
        if (!(e.destroyed || !e.autoplay.running || !p)) {
          if (
            (clearTimeout(m),
            clearTimeout(o),
            e.params.autoplay.disableOnInteraction)
          ) {
            (h = !1), (p = !1);
            return;
          }
          h && e.params.cssMode && P(), (h = !1), (p = !1);
        }
      }),
      s("slideChange", () => {
        e.destroyed || !e.autoplay.running || (b = !0);
      }),
      Object.assign(e.autoplay, { start: z, stop: N, pause: T, resume: P });
  }
  const Le =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABFCAYAAAAcjSspAAAACXBIWXMAAAsSAAALEgHS3X78AAABIUlEQVR4nO3cQQrCMBBA0an0Xrqsp1JP1Sx7s7ipUPCDTi1o6n8gdpFA+IvCQLSrtcZ5GK6xX9NYypTZ0M/fl+3P8lOmzOJ+8XwbS7luepQvOw9DXbPvsPVB9sAowCjAKMAowCjAKMAowCigf73kWWOz0il53mlVlGhrVjrOn7etjRLRwKw0zz5vn/MxK/lOAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgFGAUYBRgHLe7TZm8nZ9c1YRsneTE7fZG5FHxExltJlNmVvMrfGdwowCjAKMAowCjAKMAowCjAK+OQ3hH8x+2Ttdvbpal31ZzS7dgfVDy3yF7xX1AAAAABJRU5ErkJggg==",
    de =
      "" +
      new URL(
        "ex.png",
        (document.currentScript &&
          document.currentScript.tagName.toUpperCase() === "SCRIPT" &&
          document.currentScript.src) ||
          document.baseURI
      ).href,
    tt = (t, e) => {
      const n = t.__vccOpts || t;
      for (const [s, i] of e) n[s] = i;
      return n;
    },
    Ih = { class: "hero", role: "img", "aria-label": "news hero" },
    Oh = ["src"],
    kh = { class: "news-page" },
    Rh = { class: "container" },
    Bh = { class: "icon-row" },
    $h = ["src"],
    zh = { class: "news-section" },
    Nh = { class: "sec-body" },
    Hh = { key: 0, class: "feature" },
    Fh = ["src"],
    Dh = { class: "feature-meta" },
    Gh = { class: "date" },
    jh = { class: "feature-excerpt" },
    Vh = { class: "side-list" },
    Uh = ["onClick"],
    Wh = { class: "item-date" },
    qh = { class: "item-title" },
    Kh = { class: "news-section" },
    Yh = { class: "sec-body" },
    Qh = { key: 0, class: "feature" },
    Xh = ["src"],
    Jh = { class: "feature-meta" },
    Zh = { class: "date" },
    eg = { class: "feature-excerpt" },
    tg = { class: "side-list" },
    ng = ["onClick"],
    sg = { class: "item-date" },
    ig = { class: "item-title" },
    Ma = tt(
      {
        __name: "NewsList",
        setup(t) {
          const e = oa(),
            n = ae([
              {
                id: 1,
                title: "苏海1号LNG首航成功，开启中国深远海三文鱼养殖新纪元。",
                date: "2023-05-15",
                excerpt:
                  "全球首座船载鱼类育苗工厂“苏海1号”顺利完成首航，标志着我国深远海三文鱼规模化养殖迈向里程碑。",
                cover: de,
              },
              {
                id: 2,
                title: "连深海洋与中科院联合研发三文鱼病害快速检测技术。",
                date: "2023-04-28",
                excerpt: "产学研协同创新，助力水产健康养殖。",
                cover: Le,
              },
              {
                id: 3,
                title:
                  "连深海洋与多家知名企业达成战略合作，共建三文鱼全产业链。",
                date: "2023-05-15",
                excerpt: "强强联合，推动产业高质量发展。",
                cover: Le,
              },
              {
                id: 4,
                title: "智慧渔场平台上线，养殖全过程实现数字化可视。",
                date: "2023-06-02",
                excerpt: "物联网与AI算法融合，提升生产管理效率。",
                cover: Le,
              },
              {
                id: 5,
                title: "“蓝海计划”二期启动，深海网箱扩容至百万方。",
                date: "2023-06-18",
                excerpt: "扩容提质并重，打造绿色低碳示范渔场。",
                cover: de,
              },
              {
                id: 6,
                title: "冷链加工中心投产，打通从海上到餐桌最后一公里。",
                date: "2023-07-01",
                excerpt: "全程温控、原码追溯，保障产品新鲜安全。",
                cover: Le,
              },
              {
                id: 7,
                title: "与海洋大学共建联合实验室，聚焦育种与营养研究。",
                date: "2023-07-12",
                excerpt: "校企合作，夯实技术底座。",
                cover: de,
              },
              {
                id: 8,
                title: "完成B轮融资，加速推进深远海智能养殖装备迭代。",
                date: "2023-08-03",
                excerpt: "资本助力产业升级，持续加大研发投入。",
                cover: Le,
              },
              {
                id: 9,
                title: "“海上工厂”荣获国际工业设计金奖。",
                date: "2023-08-21",
                excerpt: "以人因与可靠性为核心的系统化设计获认可。",
                cover: de,
              },
              {
                id: 10,
                title: "海外市场首单落地，三文鱼产品登陆中东。",
                date: "2023-09-06",
                excerpt: "供应链布局走向全球化。",
                cover: Le,
              },
              {
                id: 11,
                title: "智能巡检无人机入列，海上运维效率提升40%。",
                date: "2023-09-28",
                excerpt: "自动航线、边缘识别、异常预警一体化。",
                cover: de,
              },
            ]),
            s = ae([
              {
                id: 101,
                title: "工信部发布深远海养殖装备指导意见，行业迎政策利好。",
                date: "2023-04-28",
                excerpt: "规范与创新并重，推动行业升级。",
                cover: de,
              },
              {
                id: 102,
                title: "国际三文鱼价格回升，带动养殖端积极性。",
                date: "2023-05-15",
                excerpt: "需求恢复，供给收紧，价格中枢上移。",
                cover: Le,
              },
              {
                id: 103,
                title: "海水循环水养殖技术迭代，节能降耗成趋势。",
                date: "2023-05-20",
                excerpt: "新材料与智能控制系统加速应用。",
                cover: Le,
              },
              {
                id: 104,
                title: "北大西洋渔业组织发布可持续捕捞新标准。",
                date: "2023-06-01",
                excerpt: "生态红线与产能控制并举。",
                cover: de,
              },
              {
                id: 105,
                title: "全球水产饲料原料结构调整，替代蛋白占比提升。",
                date: "2023-06-15",
                excerpt: "微藻蛋白与昆虫蛋白进入规模化应用阶段。",
                cover: Le,
              },
              {
                id: 106,
                title: "港口冷链运力恢复，跨境物流时效持续改善。",
                date: "2023-06-27",
                excerpt: "运价回落，仓配一体化程度提升。",
                cover: de,
              },
              {
                id: 107,
                title: "海洋牧场碳汇核算方法学讨论稿发布。",
                date: "2023-07-04",
                excerpt: "产业链迎来“蓝碳”增量空间。",
                cover: Le,
              },
              {
                id: 108,
                title: "智慧渔业大会聚焦数字孪生与边缘智能。",
                date: "2023-07-19",
                excerpt: "从监测走向决策的系统创新。",
                cover: de,
              },
              {
                id: 109,
                title: "主要产区高温天气来袭，养殖防暑降温成为重点。",
                date: "2023-08-02",
                excerpt: "精准曝气与溶氧监测设备需求上升。",
                cover: Le,
              },
              {
                id: 110,
                title: "ESG评价体系纳入更多海洋生态指标。",
                date: "2023-08-18",
                excerpt: "绿色治理成为行业共识。",
                cover: de,
              },
              {
                id: 111,
                title: "欧洲市场对ASC认证水产品需求持续增长。",
                date: "2023-09-09",
                excerpt: "可追溯与合规成为竞争壁垒。",
                cover: Le,
              },
            ]),
            i = (o) => e.push({ name: "news-detail", params: { id: o } });
          function r(o, l) {
            const a = [];
            for (let u = 0; u < o.length; u += l) a.push(o.slice(u, u + l));
            return a;
          }
          return (o, l) => (
            K(),
            oe(
              he,
              null,
              [
                v("section", Ih, [
                  v(
                    "img",
                    { class: "hero-img", src: te(de), alt: "新闻动态" },
                    null,
                    8,
                    Oh
                  ),
                  l[4] || (l[4] = v("div", { class: "hero-mask" }, null, -1)),
                  l[5] ||
                    (l[5] = v("h1", { class: "hero-title" }, "新闻动态", -1)),
                ]),
                v("section", kh, [
                  v("div", Rh, [
                    v("div", Bh, [
                      v(
                        "img",
                        { class: "header-icon", src: te(Le), alt: "copy" },
                        null,
                        8,
                        $h
                      ),
                    ]),
                    l[8] ||
                      (l[8] = v(
                        "div",
                        { class: "header-left" },
                        [
                          v("h1", { class: "title" }, "新闻动态"),
                          v("div", { class: "title-underline" }),
                        ],
                        -1
                      )),
                    v("div", zh, [
                      l[6] ||
                        (l[6] = v(
                          "h2",
                          { class: "sec-title" },
                          "企业新闻",
                          -1
                        )),
                      v("div", Nh, [
                        n.value.length
                          ? (K(),
                            oe("div", Hh, [
                              v(
                                "img",
                                {
                                  class: "feature-img",
                                  src: n.value[0].cover,
                                  alt: "",
                                },
                                null,
                                8,
                                Fh
                              ),
                              v("div", Dh, [
                                v("div", Gh, _e(n.value[0].date), 1),
                                v(
                                  "h3",
                                  {
                                    class: "feature-title",
                                    onClick:
                                      l[0] || (l[0] = (a) => i(n.value[0].id)),
                                  },
                                  _e(n.value[0].title),
                                  1
                                ),
                                v("p", jh, _e(n.value[0].excerpt), 1),
                                v(
                                  "button",
                                  {
                                    class: "more",
                                    onClick:
                                      l[1] || (l[1] = (a) => i(n.value[0].id)),
                                  },
                                  "阅读全文"
                                ),
                              ]),
                            ]))
                          : Un("", !0),
                        Z(
                          te(is),
                          {
                            modules: [te(Ys), te(hr)],
                            pagination: { clickable: !0 },
                            loop: !0,
                            autoplay: { delay: 3e3, disableOnInteraction: !1 },
                            "slides-per-view": 1,
                            "auto-height": !1,
                            observer: !0,
                            "observe-parents": !0,
                            "space-between": 8,
                          },
                          {
                            default: ce(() => [
                              (K(!0),
                              oe(
                                he,
                                null,
                                Ye(
                                  r(n.value.slice(1), 5),
                                  (a, u) => (
                                    K(),
                                    Me(
                                      te(rs),
                                      { key: "ce-" + u },
                                      {
                                        default: ce(() => [
                                          v("ul", Vh, [
                                            (K(!0),
                                            oe(
                                              he,
                                              null,
                                              Ye(
                                                a,
                                                (c) => (
                                                  K(),
                                                  oe(
                                                    "li",
                                                    {
                                                      key: c.id,
                                                      onClick: (d) => i(c.id),
                                                    },
                                                    [
                                                      v(
                                                        "div",
                                                        Wh,
                                                        _e(c.date),
                                                        1
                                                      ),
                                                      v(
                                                        "div",
                                                        qh,
                                                        _e(c.title),
                                                        1
                                                      ),
                                                    ],
                                                    8,
                                                    Uh
                                                  )
                                                )
                                              ),
                                              128
                                            )),
                                          ]),
                                        ]),
                                        _: 2,
                                      },
                                      1024
                                    )
                                  )
                                ),
                                128
                              )),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modules"]
                        ),
                      ]),
                    ]),
                    v("div", Kh, [
                      l[7] ||
                        (l[7] = v(
                          "h2",
                          { class: "sec-title" },
                          "行业动态",
                          -1
                        )),
                      v("div", Yh, [
                        s.value.length
                          ? (K(),
                            oe("div", Qh, [
                              v(
                                "img",
                                {
                                  class: "feature-img",
                                  src: s.value[0].cover,
                                  alt: "",
                                },
                                null,
                                8,
                                Xh
                              ),
                              v("div", Jh, [
                                v("div", Zh, _e(s.value[0].date), 1),
                                v(
                                  "h3",
                                  {
                                    class: "feature-title",
                                    onClick:
                                      l[2] || (l[2] = (a) => i(s.value[0].id)),
                                  },
                                  _e(s.value[0].title),
                                  1
                                ),
                                v("p", eg, _e(s.value[0].excerpt), 1),
                                v(
                                  "button",
                                  {
                                    class: "more",
                                    onClick:
                                      l[3] || (l[3] = (a) => i(s.value[0].id)),
                                  },
                                  "阅读全文"
                                ),
                              ]),
                            ]))
                          : Un("", !0),
                        Z(
                          te(is),
                          {
                            modules: [te(Ys), te(hr)],
                            pagination: { clickable: !0 },
                            loop: !0,
                            autoplay: { delay: 3e3, disableOnInteraction: !1 },
                            "slides-per-view": 1,
                            "auto-height": !1,
                            observer: !0,
                            "observe-parents": !0,
                            "space-between": 8,
                          },
                          {
                            default: ce(() => [
                              (K(!0),
                              oe(
                                he,
                                null,
                                Ye(
                                  r(s.value.slice(1), 5),
                                  (a, u) => (
                                    K(),
                                    Me(
                                      te(rs),
                                      { key: "ie-" + u },
                                      {
                                        default: ce(() => [
                                          v("ul", tg, [
                                            (K(!0),
                                            oe(
                                              he,
                                              null,
                                              Ye(
                                                a,
                                                (c) => (
                                                  K(),
                                                  oe(
                                                    "li",
                                                    {
                                                      key: c.id,
                                                      onClick: (d) => i(c.id),
                                                    },
                                                    [
                                                      v(
                                                        "div",
                                                        sg,
                                                        _e(c.date),
                                                        1
                                                      ),
                                                      v(
                                                        "div",
                                                        ig,
                                                        _e(c.title),
                                                        1
                                                      ),
                                                    ],
                                                    8,
                                                    ng
                                                  )
                                                )
                                              ),
                                              128
                                            )),
                                          ]),
                                        ]),
                                        _: 2,
                                      },
                                      1024
                                    )
                                  )
                                ),
                                128
                              )),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modules"]
                        ),
                      ]),
                    ]),
                  ]),
                ]),
              ],
              64
            )
          );
        },
      },
      [["__scopeId", "data-v-c8ca6fd6"]]
    ),
    ge = {},
    Pa = {
      __name: "index",
      setup(t) {
        return (e, n) => (K(), Me(Ma));
      },
    };
  typeof ge == "function" && ge(Pa);
  const La = {
    __name: "index",
    setup(t) {
      return (e, n) => (K(), Me(Ma));
    },
  };
  typeof ge == "function" && ge(La);
  const rg = { class: "hero", role: "img", "aria-label": "research hero" },
    og = ["src"],
    lg = { class: "page" },
    ag = { class: "icon-row" },
    cg = ["src"],
    dg = { class: "list" },
    ug = { class: "content" },
    fg = { key: 0, class: "media" },
    pg = ["src", "alt"],
    hg = { class: "title-row" },
    gg = { class: "item-title" },
    mg = { class: "desc" },
    Ia = tt(
      {
        __name: "Research",
        setup(t) {
          const e = ae([
            {
              id: 1,
              title: "三文鱼养殖工厂适用快速病原分析系统及冻干试剂开发与应用",
              cover: de,
              summary:
                "研究背景：三文鱼工厂化养殖过程中，一旦出现群体异常染病，传播速度快，但常规手法上样不均及上游检测流程繁琐，难以及时对病原体做出明确判断。目前常规核酸检测涉及分子实验基础及严格实验手内控管理，使用者常以科研人员或三文鱼养殖各条生产岗位的养殖专员居多，且非专业的操作手法大大影响了有效判断的稳定性及检出准确。研究目标为：1）基于冻干试剂体系开发一体化分子检测方案；2）针对三文鱼工厂链路中疑似病原样本（鳃部、鳍部、肠道等），开发相应流程并建立检测报告。",
            },
            {
              id: 2,
              title: "冷链气候菌群固液捕获装置开发与应用",
              cover: de,
              summary:
                "研究背景：冷链气候环境作为抽样集菌常规线上操作中，常需要到一种界面，一旦形成气溶胶菌群就很难收集、耐活、扩增的内容。常规抽滤或布表面取样均有局限，且一旦出现破损，极易造成回抽，形成取样风险。研究目标：研制可用于高湿低温环境的菌群固液捕获装置，并配套快速核酸检测流程（重点在DNA水平），适配现场高频高湿环境下，可广泛应用的标准化抽检流程与数据沉淀，以便可视化展示冷链场景菌群风险现状。",
            },
            {
              id: 3,
              title: "工程噬菌体三文鱼养殖链路菌群宿主及流调病原体系",
              cover: de,
              summary:
                "研究背景：三文鱼工厂化养殖生物链路是一个闭环的微生态系统，细菌在不同节点中广泛分布并保持较强韧性。噬菌体作为自然界的“细菌天敌”，对维持菌群稳态具有重要意义。研究目标：1）从工艺链路关键节点中分离高效宿主噬菌体；2）构建宿主-噬菌体对应关系及菌群流调数据库；3）建立面向现场的标准化快速检测与处置方案。",
            },
          ]);
          return (n, s) => (
            K(),
            oe(
              he,
              null,
              [
                v("section", rg, [
                  v(
                    "img",
                    { class: "hero-img", src: te(de), alt: "科研平台" },
                    null,
                    8,
                    og
                  ),
                  s[0] || (s[0] = v("div", { class: "hero-mask" }, null, -1)),
                  s[1] ||
                    (s[1] = v("h1", { class: "hero-title" }, "科研平台", -1)),
                ]),
                v("section", lg, [
                  v("div", ag, [
                    v(
                      "img",
                      { class: "header-icon", src: te(Le), alt: "copy" },
                      null,
                      8,
                      cg
                    ),
                  ]),
                  s[4] ||
                    (s[4] = v(
                      "div",
                      { class: "header-left" },
                      [
                        v("h1", { class: "title" }, "科研平台"),
                        v("div", { class: "title-underline" }),
                      ],
                      -1
                    )),
                  s[5] ||
                    (s[5] = v("div", { class: "divider dashed" }, null, -1)),
                  v("ul", dg, [
                    (K(!0),
                    oe(
                      he,
                      null,
                      Ye(
                        e.value,
                        (i, r) => (
                          K(),
                          oe("li", { key: i.id, class: "item" }, [
                            s[3] ||
                              (s[3] = v("div", { class: "media" }, null, -1)),
                            v("div", ug, [
                              i.cover
                                ? (K(),
                                  oe("div", fg, [
                                    v(
                                      "img",
                                      { src: i.cover, alt: i.title },
                                      null,
                                      8,
                                      pg
                                    ),
                                  ]))
                                : Un("", !0),
                              v("div", hg, [
                                v("h3", gg, _e(r + 1) + ". " + _e(i.title), 1),
                              ]),
                              s[2] ||
                                (s[2] = v(
                                  "span",
                                  { class: "item-underline" },
                                  null,
                                  -1
                                )),
                              v("div", mg, [v("p", null, _e(i.summary), 1)]),
                            ]),
                          ])
                        )
                      ),
                      128
                    )),
                  ]),
                ]),
              ],
              64
            )
          );
        },
      },
      [["__scopeId", "data-v-2ad75555"]]
    ),
    Oa = {
      __name: "research",
      setup(t) {
        return (e, n) => (K(), Me(Ia));
      },
    };
  typeof ge == "function" && ge(Oa);
  const vg = {
      class: "page-hero",
      role: "img",
      "aria-label": "product hero",
      "data-hero": "",
    },
    yg = ["src"],
    bg = { class: "page" },
    wg = { class: "icon-row" },
    _g = ["src"],
    Sg = { class: "product-swiper-container" },
    Eg = { class: "image-swiper-container" },
    xg = { class: "slide-image" },
    Tg = ["src", "alt"],
    Cg = { class: "swiper-pagination-custom" },
    Ag = { class: "dots" },
    Mg = ["onClick"],
    Pg = { class: "numbers" },
    Lg = ["onClick"],
    Ig = { class: "slide-content" },
    Og = { class: "slide-specs" },
    kg = { class: "product-title" },
    Rg = { class: "specs-content" },
    Bg = { class: "left" },
    $g = { class: "kv" },
    zg = { class: "right" },
    Ng = { class: "caption" },
    Hg = { class: "usage-list" },
    Fg = { class: "usage-label" },
    Dg = { class: "usage-value" },
    Gg = { class: "processing" },
    jg = { class: "processing-intro" },
    Vg = { class: "left" },
    Ug = ["src"],
    Wg = { class: "corner-icon" },
    qg = ["src"],
    Kg = { class: "marketing" },
    Yg = { class: "map" },
    Qg = ["src"],
    ka = tt(
      {
        __name: "ProductList",
        setup(t) {
          const e = [Ys, Ph],
            n = ae(null),
            s = ae(null),
            i = ae(0),
            r = ae(!1),
            o = (f) => {
              n.value = f;
            },
            l = (f) => {
              s.value = f;
            },
            a = (f) => {
              n.value && n.value.slideTo(f),
                s.value && s.value.slideTo(f),
                (i.value = f);
            },
            u = (f) => {
              r.value ||
                ((i.value = f.activeIndex),
                s.value &&
                  ((r.value = !0),
                  s.value.slideTo(f.activeIndex),
                  setTimeout(() => {
                    r.value = !1;
                  }, 100)));
            },
            c = (f) => {
              r.value ||
                ((i.value = f.activeIndex),
                n.value &&
                  ((r.value = !0),
                  n.value.slideTo(f.activeIndex),
                  setTimeout(() => {
                    r.value = !1;
                  }, 100)));
            },
            d = ae([
              {
                id: 1,
                image: de,
                title: "整条鱼（带头去脏）",
                specs: [
                  { label: "保质期：", value: "冰鲜产品15天 / 冷冻产品24个月" },
                  { label: "三文鱼品种：", value: "大西洋海水紅" },
                  { label: "产品形态：", value: "鲜品 / 冻品" },
                  {
                    label: "储存条件：",
                    value: "冰鲜产品0-4℃冷保存 / 冷冻产品-1-25℃冷冻保存",
                  },
                  { label: "产品规格：", value: "5kg+" },
                ],
                usage: {
                  title: "使用方法",
                  content: [
                    {
                      label: "冰鲜产品：",
                      value:
                        "可根据产品应用需求、直接分割-分割满足生食加工条件",
                    },
                    { label: "冷冻产品：", value: "0-4℃低温解冻,流水温水解冻" },
                  ],
                },
              },
              {
                id: 2,
                image: de,
                title: "整条鱼（带头去脏）",
                specs: [
                  { label: "保质期：", value: "冰鲜产品15天 / 冷冻产品24个月" },
                  { label: "三文鱼品种：", value: "大西洋海水紅" },
                  { label: "产品形态：", value: "鲜品 / 冻品" },
                  {
                    label: "储存条件：",
                    value: "冰鲜产品0-4℃冷保存 / 冷冻产品-1-25℃冷冻保存",
                  },
                  { label: "产品规格：", value: "5kg+" },
                ],
                usage: {
                  title: "使用方法",
                  content: [
                    {
                      label: "冰鲜产品：",
                      value:
                        "可根据产品应用需求、直接分割-分割满足生食加工条件",
                    },
                    { label: "冷冻产品：", value: "0-4℃低温解冻,流水温水解冻" },
                  ],
                },
              },
              {
                id: 3,
                image: de,
                title: "整条鱼（带头去脏）",
                specs: [
                  { label: "保质期：", value: "冰鲜产品15天 / 冷冻产品24个月" },
                  { label: "三文鱼品种：", value: "大西洋海水紅" },
                  { label: "产品形态：", value: "鲜品 / 冻品" },
                  {
                    label: "储存条件：",
                    value: "冰鲜产品0-4℃冷保存 / 冷冻产品-1-25℃冷冻保存",
                  },
                  { label: "产品规格：", value: "5kg+" },
                ],
                usage: {
                  title: "使用方法",
                  content: [
                    {
                      label: "冰鲜产品：",
                      value:
                        "可根据产品应用需求、直接分割-分割满足生食加工条件",
                    },
                    { label: "冷冻产品：", value: "0-4℃低温解冻,流水温水解冻" },
                  ],
                },
              },
              {
                id: 4,
                image: de,
                title: "整条鱼（带头去脏）",
                specs: [
                  { label: "保质期：", value: "冰鲜产品15天 / 冷冻产品24个月" },
                  { label: "三文鱼品种：", value: "大西洋海水紅" },
                  { label: "产品形态：", value: "鲜品 / 冻品" },
                  {
                    label: "储存条件：",
                    value: "冰鲜产品0-4℃冷保存 / 冷冻产品-1-25℃冷冻保存",
                  },
                  { label: "产品规格：", value: "5kg+" },
                ],
                usage: {
                  title: "使用方法",
                  content: [
                    {
                      label: "冰鲜产品：",
                      value:
                        "可根据产品应用需求、直接分割-分割满足生食加工条件",
                    },
                    { label: "冷冻产品：", value: "0-4℃低温解冻,流水温水解冻" },
                  ],
                },
              },
              {
                id: 5,
                image: de,
                title: "整条鱼（带头去脏）",
                specs: [
                  { label: "保质期：", value: "冰鲜产品15天 / 冷冻产品24个月" },
                  { label: "三文鱼品种：", value: "大西洋海水紅" },
                  { label: "产品形态：", value: "鲜品 / 冻品" },
                  {
                    label: "储存条件：",
                    value: "冰鲜产品0-4℃冷保存 / 冷冻产品-1-25℃冷冻保存",
                  },
                  { label: "产品规格：", value: "5kg+" },
                ],
                usage: {
                  title: "使用方法",
                  content: [
                    {
                      label: "冰鲜产品：",
                      value:
                        "可根据产品应用需求、直接分割-分割满足生食加工条件",
                    },
                    { label: "冷冻产品：", value: "0-4℃低温解冻,流水温水解冻" },
                  ],
                },
              },
            ]);
          return (f, p) => (
            K(),
            oe(
              he,
              null,
              [
                v("section", vg, [
                  v(
                    "img",
                    { class: "page-hero-img", src: te(de), alt: "产品中心" },
                    null,
                    8,
                    yg
                  ),
                  p[0] ||
                    (p[0] = v("div", { class: "page-hero-mask" }, null, -1)),
                  p[1] ||
                    (p[1] = v(
                      "h1",
                      { class: "page-hero-title" },
                      "产品中心",
                      -1
                    )),
                ]),
                v("section", bg, [
                  v("div", wg, [
                    v(
                      "img",
                      { class: "header-icon", src: te(Le), alt: "copy" },
                      null,
                      8,
                      _g
                    ),
                  ]),
                  p[6] ||
                    (p[6] = v(
                      "div",
                      { class: "header-left" },
                      [
                        v("h1", { class: "title" }, "产品中心"),
                        v("div", { class: "title-underline" }),
                      ],
                      -1
                    )),
                  p[7] ||
                    (p[7] = v("div", { class: "divider dashed" }, null, -1)),
                  v("div", Sg, [
                    v("div", Eg, [
                      Z(
                        te(is),
                        {
                          modules: e,
                          "slides-per-view": 1,
                          "space-between": 0,
                          pagination: !1,
                          navigation: !1,
                          onSwiper: o,
                          onSlideChange: u,
                          class: "image-swiper",
                        },
                        {
                          default: ce(() => [
                            (K(!0),
                            oe(
                              he,
                              null,
                              Ye(
                                d.value,
                                (h) => (
                                  K(),
                                  Me(
                                    te(rs),
                                    { key: h.id, class: "swiper-slide-custom" },
                                    {
                                      default: ce(() => [
                                        v("div", xg, [
                                          v(
                                            "img",
                                            { src: h.image, alt: h.title },
                                            null,
                                            8,
                                            Tg
                                          ),
                                        ]),
                                      ]),
                                      _: 2,
                                    },
                                    1024
                                  )
                                )
                              ),
                              128
                            )),
                          ]),
                          _: 1,
                        }
                      ),
                      v("div", Cg, [
                        v("div", Ag, [
                          (K(!0),
                          oe(
                            he,
                            null,
                            Ye(
                              d.value,
                              (h, m) => (
                                K(),
                                oe(
                                  "span",
                                  {
                                    key: m,
                                    class: De([
                                      "dot",
                                      {
                                        "swiper-pagination-bullet-active-custom":
                                          m === i.value,
                                      },
                                    ]),
                                    onClick: (b) => a(m),
                                  },
                                  null,
                                  10,
                                  Mg
                                )
                              )
                            ),
                            128
                          )),
                        ]),
                        v("div", Pg, [
                          (K(!0),
                          oe(
                            he,
                            null,
                            Ye(
                              d.value,
                              (h, m) => (
                                K(),
                                oe(
                                  "span",
                                  {
                                    key: m,
                                    onClick: (b) => a(m),
                                    class: De({ active: m === i.value }),
                                  },
                                  _e(String(m + 1).padStart(2, "0")),
                                  11,
                                  Lg
                                )
                              )
                            ),
                            128
                          )),
                        ]),
                      ]),
                    ]),
                    Z(
                      te(is),
                      {
                        modules: e,
                        "slides-per-view": 1,
                        "space-between": 0,
                        pagination: !1,
                        navigation: !1,
                        onSwiper: l,
                        onSlideChange: c,
                        class: "content-swiper",
                      },
                      {
                        default: ce(() => [
                          (K(!0),
                          oe(
                            he,
                            null,
                            Ye(
                              d.value,
                              (h) => (
                                K(),
                                Me(
                                  te(rs),
                                  { key: h.id, class: "swiper-slide-custom" },
                                  {
                                    default: ce(() => [
                                      v("div", Ig, [
                                        v("div", Og, [
                                          v("div", kg, _e(h.title), 1),
                                          v("div", Rg, [
                                            v("div", Bg, [
                                              v("ul", $g, [
                                                (K(!0),
                                                oe(
                                                  he,
                                                  null,
                                                  Ye(
                                                    h.specs,
                                                    (m) => (
                                                      K(),
                                                      oe(
                                                        "li",
                                                        { key: m.label },
                                                        [
                                                          v(
                                                            "span",
                                                            null,
                                                            _e(m.label),
                                                            1
                                                          ),
                                                          v(
                                                            "span",
                                                            null,
                                                            _e(m.value),
                                                            1
                                                          ),
                                                        ]
                                                      )
                                                    )
                                                  ),
                                                  128
                                                )),
                                              ]),
                                            ]),
                                            v("div", zg, [
                                              v(
                                                "div",
                                                Ng,
                                                _e(h.usage.title),
                                                1
                                              ),
                                              v("div", Hg, [
                                                (K(!0),
                                                oe(
                                                  he,
                                                  null,
                                                  Ye(
                                                    h.usage.content,
                                                    (m, b) => (
                                                      K(),
                                                      oe(
                                                        "div",
                                                        {
                                                          key: b,
                                                          class: "usage-item",
                                                        },
                                                        [
                                                          v(
                                                            "span",
                                                            Fg,
                                                            _e(m.label),
                                                            1
                                                          ),
                                                          v(
                                                            "span",
                                                            Dg,
                                                            _e(m.value),
                                                            1
                                                          ),
                                                        ]
                                                      )
                                                    )
                                                  ),
                                                  128
                                                )),
                                              ]),
                                            ]),
                                          ]),
                                        ]),
                                      ]),
                                    ]),
                                    _: 2,
                                  },
                                  1024
                                )
                              )
                            ),
                            128
                          )),
                        ]),
                        _: 1,
                      }
                    ),
                  ]),
                  v("div", Gg, [
                    p[3] ||
                      (p[3] = v(
                        "div",
                        { class: "section-caption" },
                        "海上加工中心",
                        -1
                      )),
                    v("div", jg, [
                      v("div", Vg, [
                        v(
                          "img",
                          { src: te(de), alt: "加工中心图片" },
                          null,
                          8,
                          Ug
                        ),
                      ]),
                      p[2] ||
                        (p[2] = Ut(
                          '<div class="right" data-v-872c3d89><h3 class="processing-title" data-v-872c3d89>全球首个三文鱼&quot;海上加工中心&quot;</h3><div class="processing-line" data-v-872c3d89></div><p class="processing-intro-text" data-v-872c3d89>&quot;苏海1号&quot;配备全球首个三文鱼海上加工车间:</p><div class="metrics" data-v-872c3d89><div class="metric" data-v-872c3d89><b data-v-872c3d89>双加工线</b><span data-v-872c3d89>冰鲜和速冻</span></div><div class="metric" data-v-872c3d89><b data-v-872c3d89>100吨</b><span data-v-872c3d89>24小时冰鲜加工产能</span></div><div class="metric" data-v-872c3d89><b data-v-872c3d89>5吨</b><span data-v-872c3d89>24小时速冻加工产能</span></div></div><p class="processing-text" data-v-872c3d89>加工鱼货通过辅助运输船和高效冷链物流,快速将极致新鲜的产品送达国内主要消费市场,从而在产品新鲜度和口感上相较进口冰鲜三文鱼形成显著优势。</p></div>',
                          1
                        )),
                    ]),
                    v("div", Wg, [
                      v(
                        "img",
                        { class: "header-icon", src: te(Le), alt: "copy" },
                        null,
                        8,
                        qg
                      ),
                    ]),
                  ]),
                  v("div", Kg, [
                    p[4] ||
                      (p[4] = v(
                        "div",
                        { class: "section-caption" },
                        "营销布局",
                        -1
                      )),
                    v("div", Yg, [
                      v(
                        "img",
                        { src: te(de), alt: "全球营销网络示意" },
                        null,
                        8,
                        Qg
                      ),
                    ]),
                    p[5] ||
                      (p[5] = v(
                        "div",
                        { class: "map-content" },
                        [
                          v(
                            "div",
                            { class: "sub-caption" },
                            "加工与冷链储运体系"
                          ),
                          v("div", { class: "sub-caption-underline" }),
                          v(
                            "p",
                            { class: "note" },
                            "以部分自建、部分会作的形式,形成覆盖全国各销售区域的加工与储运体系,建设产品全链条可监测体系,测测系统清節可查,确保产品质量与安全。"
                          ),
                        ],
                        -1
                      )),
                  ]),
                ]),
              ],
              64
            )
          );
        },
      },
      [["__scopeId", "data-v-872c3d89"]]
    ),
    Ra = {
      __name: "products",
      setup(t) {
        return (e, n) => (K(), Me(ka));
      },
    };
  typeof ge == "function" && ge(Ra);
  const Xg =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHDElEQVR4AeyaeahVVRTGfQ1kUUQ0IGk00CREFBFlRFgRjUT9oU/TzDQz08w0M22eTCvTyswG00pMjWhAGohKorJoJCojsoGyIoqI5vH1+y7ex7777LXvOfeeAfHJt11nrXXW2mt979xz7zl7b9ZrE//XQ8AmfgH06rkCeq6ADAx0dXX1ZuyfISRxKvF9NBKOigypPwIUPZIav2Os5XgNoz/HmUDMfQR8o8HxSmTlSE0AlV7F2I4hHM5/K2ki9dXAuVsRM5pRxyBsy+tKVTILAY95RR6AvoIm9kWmxc/eiZ3EL/NspapZCFhEZR8yXByIIhL2RkbR0dHxJyfcyvAxFBKW+say9NQE0MAHFNXJ+Ijh4iAUfRz2QkZBjqs54RqGj2GQ8JBvLENPTYCKoYH3kSLhY6SLg1FEwp7IKMhhkTAcEh6IBhfgzESA5qeB95Ai4ROki0NQ9HHYHRkFOSwSRkDC4mhwzs7MBGh+GngXKRLWIV0ciiISdkNGQQ6LhJGQoPtNND4vZ0sEaHIaeBs5hPEZw8VhKCKhLzIKclgkjIIE/WaIxufhbJkATU4DbyJ1JXyBdDEARfeEXZFRkMMiYTQk3BMNbsHph7RFgJLRwBtIkfAl0sURKLoS+iCjIIdFwhhIWBgNbtPZNgGanwZeR4qEr5AujkQRCbsgoyCHRcJYSFgQDW7DmQsBmp8G1iB1T/ga6eIoFJGwEzIKclgkjIOE+dHgFp25EaD5aeAVpK6Eb5EuBqKIhB2RUZDDImE8JNwRDW7BmSsBmp8GXkaKBD05ctiNYzgSCTsgoyCHRcIESLgtGpzRmTsBmp8GXkKKhO+RLo5FEQnbI6Mgh0XCREiYGw3O4CyEAM1PA6uRgxk/MFwchyIS6o/WqGGQwyJhEiTMCUdlsxZGgMqggReRuhJ+RLo4HkUkbIuMghwWCZMh4ZZocApnoQRofhp4HikSfkK6OBFFJGyDjIIcFglTIOGmaHATZ+EEaH4aeA4pEvwXIidhFwm9kVGQwyJhKiTMigZHnKUQoPlp4Fmk7gm/IF2cgiIS9MqMQxvksEiYBgkz7UjbUxoBKoEGnkHqSvgN6eJUlOU0sSUyCnJYJEwn/oZocMBZKgGanwaeQoqEP5AuTkPRlbA5MgpyWCTMgITrosGes3QCND8NrEKKhL+QLk5HWUUTHcgoyGGRcDnxodduwXyVEKBKaOBJpO4J/yBdnIDiP1liSoIcFglXQoK+gpNBnqUyAlQHDTyBFAn/IV30pYFJrsE6JodFwkBybG3F1e2VErChiC2QoTqafisQV4d/FdXtPrF1e7cMTdztLPqAv9Ag5ggtka3jLzsbX1OQYwYnhW58q8mhtQjcNiojgMKt5h+l3H0YTUGOSzkp9NV3Lc0fja8pKiGAwq3mtfzWSfFdzSonxzTOuZHh43ritY7p24N66QRQuNX841So5v9FRkGOqZwQ+vk7k+avwJcapRJA4Vbz+kocQvF/N6ucHFM4J/QANIv4y/BlQmkEULjVfO1HEcU3vWGR4yK6Cz0CzyZ+Or7MKIUACrear/0spnj/Z3GiEXJciDG0unwz8boZ4s6OwgmgcKv5pylXn3n/wQhzI8gxEcs8ho85NH+Jb8yiF0oAhVvN69FYzfuPxonayTEBY+hF6FyavxhfWyiMAAq3mq+9HKF4/+VIohFynI8x9Cp8HvGT8bWNQgigcKv52usxivdfjyUaIcd5GO9k+LideN0MfXtLeu4EULjV/AtUqMvef0GKuRHkGIvlLoaP+TSvm6Fvb1nPlQAKt5rXK3I1778iTxROjjEYQwuiC2j+Any5IjcCKNxqvrZIQvH+IkmiEXJoG11oSXwh8eMTATkYciGAwq3ma8tkFO8vkyVKJ8fZGEObIu4mfhy+VMh6UtsEULjV/KsUo8veXyjF3AhyaBfq/Y3WmnYvzetmWFOK+K8tAijcal5L5YMp3l8qT/RAjhEYQxujFhF/Lr5C0TIBFG41X9ssQfHrm1VOjuGcE9oat5j4c/AVjpYIoHCr+dp2GYpv+lKTHMPoLrQ5cgnxo/CVgswEULjV/FtUrM+8v2EKcyPIMRRLaHvsgzSvmyHucpCJAAq3mn+HcvWZ97fMYW4EObQeENogvZTmz2o8u3gtNQEUfjLlhF5gatOkmv8UfxTkEIGhLfLLaP7MaHBBztQEML9+niIaUNs2S/H+ttmGkxwl9Pb2YeJ1P3BOK+8wCwH+psfaxmmK9zdOB6vnr78Hjv0YLlYQf4ZrKPs4CwF6G/PrhgJfQ+qy97fOYw6DRj/Hs4RRxyPYtK2urlciUxNAsbpx7UyV/TkewFjLcSYQozt8P4L6cawlMQ6rRWoCVCZF/85I/VdXjD+IX6/h26vSMxFQVZFFzttDQJHsbgy5N/oroF2S/wcAAP//1Em3dQAAAAZJREFUAwAAEDqf712YsgAAAABJRU5ErkJggg==",
    Jg =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAGaElEQVR4AeybOY9cRRDH14gAkAiRCAgIiUAiQIRkfALAGJ8YHxgfGB8YH5j7vu/T3Kc/BEJCIkAkJKQkCIkcIQIwv99YK/Ur1cy+nnfMWl6raqerprum/n+/6devaveSpYv83xoBF/kFsLR2BaxdAauIgXPnzl2GXtclJdZfrbaNsWq+AiR9mqT/RH9l/COv1cK6b1n0h8r4I15XlFVBAMmeItNH0CtR5WZ8tzpoq8z/mrm3ocuyFd+1y8a014UTQJInSO4xNMpf0THNJsaXvHcHWsrP69at+610ZOOFEkDix0nqCTTKWZL/ITozmxif478TjfJsdGT2wggg8WMk9CQaRfC3R2dmE+Mz/HehUdZD4NnozOyFEEDiR0nmaTRKDfhPWLwRjbIB8N9E5zR7dAIAf5hkssuzBrw7/GbiRNkI+K+ic5Y9KgGAP0Qyz6NRasB/yOKtaJRNgP8iOleyRyMA8AdJ5gU0Sg34D1h8NxplC+DdDKN/RXsUAgB/gExeQqPUgH+PxdvRKNsA/2l0TrOjf3ACAL+PD30FjVID/h0W70CjbAf8x9FZYw9KAODvI5nX0Cg14N9i8S40yg7An4nOWnswAgC/h2TeQKPUgHf9vTEA9k7Aux8w7CaDEAD43aT1JhqlBvzrLPYK4qUhuwH/fsPTweidAMDvJJ+30Sg14F9l8V40yh7AvxudXexeCQC8G1WWYA34lwG0H42yF/AZsXFeld0bAYD3FuWtKiZQA/5FFt+PRtkH+OwrFedV270QAPhtfHK2KdWA95D0AHGiHAC8m2H092J3JgDwW8gkux3VgH+OGB6TeWnIQcBnt9HGpC5GJwIA7wNJdhCpAf8MAI6gUQ4BPjtAxXmd7LkJALyPoj6SxgRqwD/F4gfRKIcBnx2d47zO9lwEAH4Dn2wxgpeG1IC3GPJQY/V54yjg3QzPWwP/rCYA8OvJKXvsrAH/ODEsh/HSkGOAzx6XG5P6NKoIALyFx6zgUAP+UQCcRKMcB3xWKInzerVbEwB4/8csPccEasB/x+KH0SgnAJ+VyOK83u3WBPDJ1vF4aUgN+MtZeQsa5RTg3Qyjvxd7pSA1BGSx/s2cU3z/TfFfOsU/iruGABsYMan1fDWyDTHOW+J/+R+c36NRThPDrlD0j2K3JgAAnsW9A8TENgAguyXGeZLgVyDrAi2MhNYEiAYSrLdnXZiNkJAdilzWUGLYBM26QQshoYoAkQDAO0HWjdkMCdmx2GUNJYbN0GzjG52EagJEAgCbkZscB90CCdmDUZi25NfBPcXngKXwb1QS5iLAhCHBOrxPgpqlboOE7NG4nDMZE8OjcHb4GY2EuQkQAQCsx1sL0Cx1OyRkxZFyzmRMDJuk2fF3FBI6ESACAPi9z7o1OyDBer7TZioxPGRlD0CDk9CZAJEBwGblPY6D7oKEVnU8Ytg0tR4YQiwNSkIvBJgxAGxaWhHWLHU3JHiGKH3pmBiWxLIiyGAk9EaAiABgvd6egGapeyDBOn/pS8fEsImalcEGIaFXAkQEAMviWTdnLyRY73faTCWGzdSsENo7Cb0TIDIAuPllXZ39kJBd4i5rKDFsqtoXbPgxeiVhEAJI0oOOyQtCs9QDkNCq3gcJkiiZ5XrHvZEwGAFmCQAvYy9nzVIPQoJ9gNKXjonh18mvVXw/JSFOWskelAA/HABuaFm35xAk2A9w2kwlhhurG2yc15mEwQkwYwC4+XmL0yz1CCRkR+FyzmRMDG+x3mondvGjEwmjEGCyAPCQ42FHs9SjkNCqHkgMD1seusr1jucmYTQCzBIAHnc99mqWegwS7BOUvnRMDI/dHr/j+3ORMCoBZgwAH3yybtBxSLBf4LSZSgwfwHwQi/OqSRidADMGgJufj8KapZ6EhKxkVs6ZjInho7iP5BO7+FFFwkIIMFkAWAyxKKJZ6ilIaFUkJYZFGYsz5XrHkmDpzfFMXRgBZgUAy2KWxzRLFcD1pWPamBiW57JulZurvYhpSyf+hRJgBgCwQJp1i270/TZKDJu1FmzL6VdgTOtF8NZ5WTgBpgEANz8v++U/kvgJX7bTOz1V5luyL39F/gw+exHp/GXnqiDAZEjWpulVjG9gfBOv1cI6/87gGhZew9jfWWI4W1YNAaZJ0n+jvzieV1n/u9p2/aoioG3Sfc5bI6BPNi/EWBf8FdCV9P8BAAD//+rcZ7MAAAAGSURBVAMALX8Qn5Hlr2QAAAAASUVORK5CYII=",
    Zg = { class: "hero", role: "img", "aria-label": "home hero" },
    em = ["src", "alt"],
    tm = { class: "hero-controls" },
    nm = ["src"],
    sm = { class: "hero-right" },
    im = { class: "hero-counter" },
    rm = ["src"],
    om = { class: "section" },
    lm = { class: "cards" },
    am = { class: "section" },
    cm = { class: "news" },
    Ba = tt(
      {
        __name: "Home",
        setup(t) {
          const e = [
              { src: de, alt: "连深海洋 一" },
              { src: Le, alt: "连深海洋 二" },
            ],
            n = [hr, Ys, Lh],
            s = ae(null),
            i = ae(1),
            r = e.length,
            o = ze(() => String(i.value).padStart(2, "0")),
            l = ze(() => String(r).padStart(2, "0"));
          function a(p) {
            (s.value = p), (i.value = c(p));
          }
          function u(p) {
            i.value = c(p);
          }
          function c(p) {
            var m;
            const h =
              ((m = p == null ? void 0 : p.realIndex) != null ? m : 0) + 1;
            return h <= 0 ? 1 : h;
          }
          function d() {
            var p;
            (p = s.value) == null || p.slideNext();
          }
          function f() {
            var p;
            (p = s.value) == null || p.slidePrev();
          }
          return (p, h) => {
            const m = yn("router-link");
            return (
              K(),
              oe(
                he,
                null,
                [
                  v("section", Zg, [
                    Z(
                      te(is),
                      {
                        class: "hero-swiper",
                        modules: n,
                        loop: !0,
                        speed: 700,
                        autoplay: {
                          delay: 4e3,
                          disableOnInteraction: !1,
                          pauseOnMouseEnter: !0,
                        },
                        pagination: !1,
                        a11y: { enabled: !0 },
                        onSwiper: a,
                        onSlideChange: u,
                      },
                      {
                        default: ce(() => [
                          (K(),
                          oe(
                            he,
                            null,
                            Ye(e, (b, w) =>
                              Z(
                                te(rs),
                                { key: w },
                                {
                                  default: ce(() => [
                                    v(
                                      "img",
                                      {
                                        class: "hero-img",
                                        src: b.src,
                                        alt: b.alt,
                                      },
                                      null,
                                      8,
                                      em
                                    ),
                                  ]),
                                  _: 2,
                                },
                                1024
                              )
                            ),
                            64
                          )),
                        ]),
                        _: 1,
                      }
                    ),
                    v("div", tm, [
                      v(
                        "span",
                        {
                          class: "hero-prev",
                          role: "button",
                          "aria-label": "上一张",
                          onClick: f,
                        },
                        [
                          v(
                            "img",
                            { class: "hero-icon", src: te(Jg), alt: "上一张" },
                            null,
                            8,
                            nm
                          ),
                        ]
                      ),
                      v("div", sm, [
                        v("span", im, _e(o.value) + "/" + _e(l.value), 1),
                        v(
                          "span",
                          {
                            class: "hero-next",
                            role: "button",
                            "aria-label": "下一张",
                            onClick: d,
                          },
                          [
                            v(
                              "img",
                              {
                                class: "hero-icon",
                                src: te(Xg),
                                alt: "下一张",
                              },
                              null,
                              8,
                              rm
                            ),
                          ]
                        ),
                      ]),
                    ]),
                    h[0] || (h[0] = v("div", { class: "hero-mask" }, null, -1)),
                    h[1] ||
                      (h[1] = v("h1", { class: "hero-title" }, "连深海洋", -1)),
                  ]),
                  h[4] ||
                    (h[4] = v(
                      "section",
                      { class: "section" },
                      [
                        v("h2", null, "关于连深"),
                        v("p", null, "企业简介、使命愿景与核心价值观概述。"),
                      ],
                      -1
                    )),
                  h[5] ||
                    (h[5] = v(
                      "section",
                      { class: "section" },
                      [
                        v("h2", null, "养殖模式"),
                        v(
                          "p",
                          null,
                          "陆海接力、深远海工船、黄海冷水团等创新模式。"
                        ),
                      ],
                      -1
                    )),
                  h[6] ||
                    (h[6] = v(
                      "section",
                      { class: "section" },
                      [
                        v("h2", null, "科研平台"),
                        v("p", null, "科研项目与平台能力展示。"),
                      ],
                      -1
                    )),
                  v("section", om, [
                    h[2] || (h[2] = v("h2", null, "产品中心", -1)),
                    v("div", lm, [
                      (K(),
                      oe(
                        he,
                        null,
                        Ye(4, (b) =>
                          v(
                            "div",
                            { class: "card", key: b },
                            "主力产品 " + _e(b),
                            1
                          )
                        ),
                        64
                      )),
                    ]),
                  ]),
                  v("section", am, [
                    h[3] || (h[3] = v("h2", null, "新闻动态", -1)),
                    v("ul", cm, [
                      (K(),
                      oe(
                        he,
                        null,
                        Ye(3, (b) =>
                          v("li", { key: b }, [
                            Z(
                              m,
                              {
                                to: { name: "news-detail", params: { id: b } },
                              },
                              {
                                default: ce(() => [Pe("热门新闻 " + _e(b), 1)]),
                                _: 2,
                              },
                              1032,
                              ["to"]
                            ),
                          ])
                        ),
                        64
                      )),
                    ]),
                  ]),
                  h[7] ||
                    (h[7] = v(
                      "section",
                      { class: "section" },
                      [
                        v("h2", null, "联系我们"),
                        v("div", { class: "contact-grid" }, [
                          v("div", { class: "contact-card" }, [
                            v("h3", null, "加盟合作"),
                            v(
                              "p",
                              null,
                              "批发采购、渠道加盟 联系人：张主管 13800000000"
                            ),
                          ]),
                          v("div", { class: "contact-card" }, [
                            v("h3", null, "科研合作"),
                            v(
                              "p",
                              null,
                              "高校/机构合作 联系人：王老师 13900000000"
                            ),
                          ]),
                        ]),
                      ],
                      -1
                    )),
                ],
                64
              )
            );
          };
        },
      },
      [["__scopeId", "data-v-a4d37009"]]
    ),
    $a = {
      __name: "home",
      setup(t) {
        return (e, n) => (K(), Me(Ba));
      },
    };
  typeof ge == "function" && ge($a);
  const dm = { class: "hero", role: "img", "aria-label": "farming hero" },
    um = ["src"],
    fm = { class: "page" },
    pm = { class: "icon-row" },
    hm = ["src"],
    gm = { class: "section" },
    mm = { class: "container" },
    vm = { class: "icon-row" },
    ym = ["src"],
    bm = { class: "section" },
    wm = { class: "container" },
    _m = { class: "icon-row" },
    Sm = ["src"],
    za = tt(
      {
        __name: "Farming",
        setup(t) {
          return (e, n) => (
            K(),
            oe(
              he,
              null,
              [
                v("section", dm, [
                  v(
                    "img",
                    { class: "hero-img", src: te(de), alt: "养殖模式" },
                    null,
                    8,
                    um
                  ),
                  n[0] || (n[0] = v("div", { class: "hero-mask" }, null, -1)),
                  n[1] ||
                    (n[1] = v("h1", { class: "hero-title" }, "养殖模式", -1)),
                ]),
                v("section", fm, [
                  v("div", pm, [
                    v(
                      "img",
                      { class: "header-icon", src: te(Le), alt: "copy" },
                      null,
                      8,
                      hm
                    ),
                  ]),
                  n[7] ||
                    (n[7] = Ut(
                      '<div class="header-left" data-v-4b20d276><h1 class="title" data-v-4b20d276>养殖模式</h1><div class="title-underline" data-v-4b20d276></div></div><div class="section section-top" data-v-4b20d276><div class="container" data-v-4b20d276><div class="formula" data-v-4b20d276><span class="pill" data-v-4b20d276>陆基培苗</span><span class="plus" data-v-4b20d276>+</span><span class="pill" data-v-4b20d276>海区养鱼</span><span class="equal" data-v-4b20d276>=</span><span class="pill" data-v-4b20d276>陆海接力养殖新模式</span></div><div class="divider dashed" data-v-4b20d276></div><div class="features" data-v-4b20d276><div class="feature" data-v-4b20d276><div class="icon" data-v-4b20d276>↔</div><div class="f-title" data-v-4b20d276>突破空间限制</div><div class="f-desc" data-v-4b20d276>环境适应性强</div></div><div class="feature" data-v-4b20d276><div class="icon" data-v-4b20d276>📈</div><div class="f-title" data-v-4b20d276>自动化程度高</div><div class="f-desc" data-v-4b20d276>能实现全年连续生产</div><div class="f-desc" data-v-4b20d276>单位产量高</div></div><div class="feature" data-v-4b20d276><div class="icon" data-v-4b20d276>🛡️</div><div class="f-title" data-v-4b20d276>流程标准化</div><div class="f-desc" data-v-4b20d276>产品规格统一、无污染风险</div><div class="f-desc" data-v-4b20d276>质量与安全都有较高保障</div></div></div></div></div>',
                      2
                    )),
                  v("section", gm, [
                    v("div", mm, [
                      v("div", vm, [
                        v(
                          "img",
                          { class: "header-icon", src: te(Le), alt: "copy" },
                          null,
                          8,
                          ym
                        ),
                      ]),
                      n[2] ||
                        (n[2] = v(
                          "div",
                          { class: "header-left" },
                          [v("h2", { class: "title" }, "陆基苗种基地")],
                          -1
                        )),
                    ]),
                    n[3] ||
                      (n[3] = Ut(
                        '<div class="container base-grid" data-v-4b20d276><div class="base-photo-wrap" data-v-4b20d276><div class="divider dashed" data-v-4b20d276></div><img class="photo" src="' +
                          de +
                          '" alt="陆基苗种基地" data-v-4b20d276></div><div class="base-text" data-v-4b20d276><div class="divider dashed" data-v-4b20d276></div><h2 class="sub" data-v-4b20d276>连云港市赣榆区苗种基地</h2><div class="title-underline" data-v-4b20d276></div><p data-v-4b20d276> 连云港市是我国首批14个沿海开放城市之一，是新亚欧大陆桥东方桥头堡，全国性综合交通枢纽城市，国际性港口城市。赣榆区地处沿海，素有&quot;黄海明珠&quot;之称，海岸线长62.5公里，滩涂面积23万亩，浅海面积108万亩，近海渔场7000平方公里。2023年，赣榆区被列入国家沿海渔港经济区试点。 </p><p data-v-4b20d276> 连申海洋赣榆水产苗种繁育与现代化养殖示范中心位于赣榆区海头镇，总投资约15亿元，面积约2000亩。规划建设102个工厂化循环水养殖苗种车间、蓄水区、养殖尾水处理区、水质检测中心等，规划总建筑面积约22万平方米，总养殖水体18万立方米。 </p></div></div>',
                        1
                      )),
                  ]),
                  v("section", bm, [
                    v("div", wm, [
                      v("div", _m, [
                        v(
                          "img",
                          { class: "header-icon", src: te(Le), alt: "copy" },
                          null,
                          8,
                          Sm
                        ),
                      ]),
                      n[4] ||
                        (n[4] = v(
                          "div",
                          { class: "header-left" },
                          [v("h2", { class: "title" }, "深远海养殖")],
                          -1
                        )),
                      n[5] ||
                        (n[5] = v(
                          "div",
                          { class: "divider dashed" },
                          null,
                          -1
                        )),
                    ]),
                    n[6] ||
                      (n[6] = Ut(
                        '<div class="container two-col" data-v-4b20d276><div class="col" data-v-4b20d276><img class="photo" src="' +
                          de +
                          '" alt="苏海1号" data-v-4b20d276><div class="card" data-v-4b20d276><h3 class="card-title" data-v-4b20d276>三文鱼养殖工船“苏海1号”</h3><ul class="card-list" data-v-4b20d276><li data-v-4b20d276>全球首艘三文鱼养殖工程船，面向深远海环境设计。</li><li data-v-4b20d276>船体全长约 249 米，型宽 45 米，型深 21.6 米，养殖水体超 3 万立方米。</li><li data-v-4b20d276>采用全封闭、循环水工艺，搭载分级、投饵、清洗等自动化装备。</li><li data-v-4b20d276>核心水处理系统集成臭氧、紫外消杀与生物滤池，确保水质稳定。</li><li data-v-4b20d276>智能化监控平台实现溶氧、温盐、流速与鱼群行为的实时感知与联动控制。</li><li data-v-4b20d276>抗风浪等级高，适应 12 级风和 10 米以上浪高的作业海况。</li><li data-v-4b20d276>支持全年稳定养殖与加工转运，显著提升单位产量与成活率。</li><li data-v-4b20d276>与陆基苗种基地形成“陆海接力”，缩短周转时间，提高养成效率。</li></ul></div></div><div class="col" data-v-4b20d276><img class="photo" src="' +
                          de +
                          '" alt="黄海冷水团" data-v-4b20d276><div class="card" data-v-4b20d276><h3 class="card-title" data-v-4b20d276>黄海冷水团</h3><ul class="card-list" data-v-4b20d276><li data-v-4b20d276>世界罕见的海盆型冷水体，位于黄海中部海域。</li><li data-v-4b20d276>覆盖面积约 13 万平方公里，冷水体储量约 5000 立方公里。</li><li data-v-4b20d276>冷水团核心层年均温度 4.6℃-9.3℃，季节温差小、稳定性强。</li><li data-v-4b20d276>夏季表层升温时，深层仍保持低温与高溶氧，适宜冷水性鱼类生长。</li><li data-v-4b20d276>水体清洁透明、富含营养盐，为优质三文鱼提供天然生态条件。</li><li data-v-4b20d276>与工程船的移动式作业结合，可因时因地选择最优海况与水层。</li></ul></div></div></div>',
                        1
                      )),
                  ]),
                ]),
              ],
              64
            )
          );
        },
      },
      [["__scopeId", "data-v-4b20d276"]]
    ),
    Na = {
      __name: "farming",
      setup(t) {
        return (e, n) => (K(), Me(za));
      },
    };
  typeof ge == "function" && ge(Na);
  const Zv = (function () {
      const e =
        typeof document != "undefined" &&
        document.createElement("link").relList;
      return e && e.supports && e.supports("modulepreload")
        ? "modulepreload"
        : "preload";
    })(),
    ey = function (t, e) {
      return new URL(t, e).href;
    },
    ty = {},
    Em = function (e, n, s) {
      let i = Promise.resolve();
      function r(o) {
        const l = new Event("vite:preloadError", { cancelable: !0 });
        if (((l.payload = o), window.dispatchEvent(l), !l.defaultPrevented))
          throw o;
      }
      return i.then((o) => {
        for (const l of o || []) l.status === "rejected" && r(l.reason);
        return e().catch(r);
      });
    },
    xm = { class: "hero", role: "img", "aria-label": "Contact hero" },
    Tm = ["src"],
    Cm = { class: "page" },
    Am = { class: "icon-row" },
    Mm = ["src"],
    Pm = { class: "contact-card" },
    Lm = { class: "contact-card" },
    Ha = tt(
      {
        __name: "Contact",
        setup(t) {
          const e = ae(null),
            n = ae(null);
          let s = null,
            i = null;
          function r(o, l, a, u, c) {
            if (!l) return;
            const d = new o.Map(l, {
              zoom: 14,
              viewMode: "2D",
              center: c || void 0,
            });
            return (
              o.plugin("AMap.Geocoder", function () {
                new o.Geocoder({ city: u || "全国" }).getLocation(
                  a,
                  function (p, h) {
                    if (p === "complete" && h.geocodes && h.geocodes.length) {
                      const m = h.geocodes[0].location;
                      d.setCenter(m),
                        d.setZoom(16),
                        new o.Marker({ position: m, map: d });
                    } else
                      console.warn("[AMap] Geocode failed for address:", a, h),
                        c &&
                          (d.setCenter(c),
                          d.setZoom(15),
                          new o.Marker({ position: c, map: d }));
                  }
                );
              }),
              d
            );
          }
          return (
            It(() =>
              Tt(null, null, function* () {
                try {
                  if (typeof window == "undefined") return;
                  const { default: o } = yield Em(
                    () =>
                      Tt(null, null, function* () {
                        const { default: a } = yield Promise.resolve().then(
                          () => $v
                        );
                        return { default: a };
                      }),
                    void 0,
                    (Fe && Fe.tagName.toUpperCase() === "SCRIPT" && Fe.src) ||
                      new URL("assets/app.js", document.baseURI).href
                  );
                  window._AMapSecurityConfig = { securityJsCode: "" };
                  const l = yield o.load({
                    key: "",
                    version: "2.0",
                    plugins: ["AMap.Geocoder", "AMap.Scale"],
                  });
                  (s = r(
                    l,
                    e.value,
                    "江苏省连云港市赣榆区白中路泉岗路303号1202室",
                    "连云港市",
                    [119.176746, 34.839665]
                  )),
                    (i = r(
                      l,
                      n.value,
                      "深圳市盐田区盐田街道田东社区深盐路2002号 大百汇新城东六巷A栋602",
                      "深圳市",
                      [114.24842, 22.567931]
                    ));
                } catch (o) {
                  console.error(o);
                }
              })
            ),
            Li(() => {
              try {
                s && s.destroy && s.destroy();
              } catch (o) {}
              try {
                i && i.destroy && i.destroy();
              } catch (o) {}
              (s = null), (i = null);
            }),
            (o, l) => (
              K(),
              oe(
                he,
                null,
                [
                  v("section", xm, [
                    v(
                      "img",
                      { class: "hero-img", src: te(de), alt: "海港风景图" },
                      null,
                      8,
                      Tm
                    ),
                    l[0] || (l[0] = v("div", { class: "hero-mask" }, null, -1)),
                    l[1] ||
                      (l[1] = v(
                        "h1",
                        { class: "hero-title" },
                        "CONTACT US",
                        -1
                      )),
                  ]),
                  v("section", Cm, [
                    v("div", Am, [
                      v(
                        "img",
                        { class: "header-icon", src: te(Le), alt: "copy" },
                        null,
                        8,
                        Mm
                      ),
                    ]),
                    l[4] ||
                      (l[4] = v(
                        "div",
                        { class: "header-left" },
                        [
                          v("h1", { class: "title" }, "联系我们"),
                          v("div", { class: "title-underline" }),
                        ],
                        -1
                      )),
                    l[5] ||
                      (l[5] = v("div", { class: "divider dashed" }, null, -1)),
                    v("div", Pm, [
                      l[2] ||
                        (l[2] = v(
                          "div",
                          { class: "info" },
                          [
                            v("h3", null, "江苏连深海洋科技有限公司"),
                            v("div", { class: "underline" }),
                            v(
                              "p",
                              null,
                              "地址：江苏省连云港市赣榆区白中路泉岗路303号1202室"
                            ),
                            v("p", null, "批发采购、渠道合作"),
                            v("p", null, "联系人/手机：13266669799"),
                            v("p", { class: "sub" }, "高校/科研机构合作"),
                            v("p", null, "联系人/罗严：18208985972"),
                          ],
                          -1
                        )),
                      v(
                        "div",
                        { class: "map", ref_key: "mapElCompany1", ref: e },
                        null,
                        512
                      ),
                    ]),
                    v("div", Lm, [
                      l[3] ||
                        (l[3] = v(
                          "div",
                          { class: "info" },
                          [
                            v("h3", null, "广东连深海洋食品有限公司"),
                            v("div", { class: "underline" }),
                            v(
                              "p",
                              null,
                              "地址：深圳市盐田区盐田街道田东社区深盐路2002号"
                            ),
                            v("p", null, "大百汇新城东六巷A栋602"),
                            v("p", null, "批发采购、渠道合作"),
                            v("p", null, "联系人/手机：13266669799"),
                            v("p", { class: "sub" }, "高校/科研机构合作"),
                            v("p", null, "联系人/罗严：18208985972"),
                          ],
                          -1
                        )),
                      v(
                        "div",
                        { class: "map", ref_key: "mapElCompany2", ref: n },
                        null,
                        512
                      ),
                    ]),
                    l[6] ||
                      (l[6] = v(
                        "div",
                        { class: "actions" },
                        [
                          v("button", { class: "btn" }, "人才招聘"),
                          v("button", { class: "btn" }, "联系方式"),
                        ],
                        -1
                      )),
                  ]),
                ],
                64
              )
            )
          );
        },
      },
      [["__scopeId", "data-v-3f2fff2f"]]
    ),
    Fa = {
      __name: "contact",
      setup(t) {
        return (e, n) => (K(), Me(Ha));
      },
    };
  typeof ge == "function" && ge(Fa);
  const Im = { class: "hero", role: "img", "aria-label": "about hero" },
    Om = ["src"],
    km = { class: "page" },
    Rm = { class: "container" },
    Bm = { class: "icon-row" },
    $m = ["src"],
    zm = { class: "about-intro" },
    Nm = { class: "left" },
    Hm = { class: "media" },
    Fm = ["src"],
    Dm = { class: "desc" },
    Gm = { class: "gallery" },
    jm = ["src"],
    Vm = ["src"],
    Um = ["src"],
    Wm = { class: "honors" },
    qm = { class: "honors-intro" },
    Km = { class: "right" },
    Ym = { class: "honors-gallery" },
    Qm = ["src"],
    Xm = ["src"],
    Jm = ["src"],
    Da = tt(
      {
        __name: "About",
        setup(t) {
          return (e, n) => (
            K(),
            oe(
              he,
              null,
              [
                v("section", Im, [
                  v(
                    "img",
                    { class: "hero-img", src: te(de), alt: "关于我们" },
                    null,
                    8,
                    Om
                  ),
                  n[0] || (n[0] = v("div", { class: "hero-mask" }, null, -1)),
                  n[1] ||
                    (n[1] = v("h1", { class: "hero-title" }, "关于我们", -1)),
                ]),
                v("section", km, [
                  v("div", Rm, [
                    v("div", Bm, [
                      v(
                        "img",
                        { class: "header-icon", src: te(Le), alt: "copy" },
                        null,
                        8,
                        $m
                      ),
                    ]),
                    n[6] ||
                      (n[6] = Ut(
                        '<div class="header-left" data-v-76787693><h1 class="title" data-v-76787693>关于连深</h1><div class="title-underline" data-v-76787693></div></div><div class="divider dashed" data-v-76787693></div><div class="section-caption" data-v-76787693>公司简介</div>',
                        3
                      )),
                    v("div", zm, [
                      v("div", Nm, [
                        v("div", Hm, [
                          v(
                            "img",
                            { src: te(de), alt: "公司全景图" },
                            null,
                            8,
                            Fm
                          ),
                        ]),
                      ]),
                      v("div", Dm, [
                        n[2] ||
                          (n[2] = v(
                            "p",
                            null,
                            '江苏连深海洋科技有限公司（以下简称"连深海洋"）由左至海南南沙开发建设公司、连云港市鲍鱼发海洋牧场园、大百汇实业曲集团联合投资成立，矢志走在中国远洋渔业发展的前沿阵地，作为主营渔业首个上市的投资平台战略平台，公司致力于建设中国深海养殖基地，构建现代海洋渔业产业链，努力开拓三大行业集群：全球首艘鲍鱼养殖工程船、中国最大三文鱼产品供应商、中国规模最大的三文鱼产业集群。',
                            -1
                          )),
                        n[3] ||
                          (n[3] = v(
                            "p",
                            null,
                            '公司以"科技兴渔、产业强国"为发展理念，聚焦三文鱼高度远洋海洋生态产业链建设，通过创新驱动、科技赋能，全力构建"一体两核六中心"的现代化产业格局，推动我国远洋海洋渔业高质量绿色、智能化、品牌化方向发展。',
                            -1
                          )),
                        v("div", Gm, [
                          v("img", { src: te(de), alt: "图1" }, null, 8, jm),
                          v("img", { src: te(de), alt: "图2" }, null, 8, Vm),
                          v("img", { src: te(de), alt: "图3" }, null, 8, Um),
                        ]),
                      ]),
                    ]),
                    v("div", Wm, [
                      n[5] ||
                        (n[5] = v(
                          "div",
                          { class: "section-caption" },
                          "荣誉资质",
                          -1
                        )),
                      v("div", qm, [
                        n[4] || (n[4] = v("div", { class: "left" }, null, -1)),
                        v("div", Km, [
                          v("div", Ym, [
                            v(
                              "img",
                              { src: te(de), alt: "荣誉1" },
                              null,
                              8,
                              Qm
                            ),
                            v(
                              "img",
                              { src: te(de), alt: "荣誉2" },
                              null,
                              8,
                              Xm
                            ),
                            v(
                              "img",
                              { src: te(de), alt: "荣誉3" },
                              null,
                              8,
                              Jm
                            ),
                          ]),
                        ]),
                      ]),
                    ]),
                    n[7] ||
                      (n[7] = Ut(
                        '<div class="duty" data-v-76787693><div class="section-caption" data-v-76787693>企业责任</div><div class="duty-intro" data-v-76787693><div class="left" data-v-76787693></div><div class="right" data-v-76787693><div class="duty-block" data-v-76787693><p data-v-76787693>连深海洋秉持对中国远海三文鱼产业的开拓精神，以创新科技为引擎，以守护海洋生态为根基。公司持续推进绿色养殖理念，构建可持续发展体系，致力于提升海洋生态环境的自我修复力，推动产业链降碳增效、绿色低碳循环。</p></div><div class="duty-block" data-v-76787693><div class="duty-header" data-v-76787693><span class="duty-title" data-v-76787693>守护疆域，生态优先：</span><span class="duty-line" data-v-76787693></span></div><p data-v-76787693>连深海洋秉持对中国远海三文鱼产业的开拓精神，以创新科技为引擎，以守护海洋生态为根基。公司持续推进绿色养殖理念，构建可持续发展体系，致力于提升海洋生态环境的自我修复力，推动产业链降碳增效、绿色低碳循环。</p></div><div class="duty-block" data-v-76787693><div class="duty-header" data-v-76787693><span class="duty-title" data-v-76787693>科技赋能，责任为本：</span><span class="duty-line" data-v-76787693></span></div><p data-v-76787693>我们以&quot;科技兴渔、产业强国&quot;为发展理念，聚焦三文鱼高度远洋海洋生态产业链建设，通过技术创新、装备升级与数字化能力建设，全面提升从育苗、养殖到加工、供应链运营的综合效率与安全水平。</p></div><div class="duty-block" data-v-76787693><div class="duty-header" data-v-76787693><span class="duty-title" data-v-76787693>产业共荣，责任共担：</span><span class="duty-line" data-v-76787693></span></div><p data-v-76787693>面向&quot;一个体两核六中心&quot;的现代化产业格局，连深海洋积极联动上下游伙伴、科研院校与地方政府，推动海洋渔业高质量绿色、智能化、品牌化发展，实现企业价值与社会价值的同频共振。</p></div></div></div></div>',
                        1
                      )),
                  ]),
                ]),
              ],
              64
            )
          );
        },
      },
      [["__scopeId", "data-v-76787693"]]
    ),
    Ga = {
      __name: "about",
      setup(t) {
        return (e, n) => (K(), Me(Da));
      },
    };
  typeof ge == "function" && ge(Ga);
  const ja = {
    __name: "research",
    setup(t) {
      return (e, n) => (K(), Me(Ia));
    },
  };
  typeof ge == "function" && ge(ja);
  const Va = {
    __name: "products",
    setup(t) {
      return (e, n) => (K(), Me(ka));
    },
  };
  typeof ge == "function" && ge(Va);
  const Ua = {
    __name: "home",
    setup(t) {
      return (e, n) => (K(), Me(Ba));
    },
  };
  typeof ge == "function" && ge(Ua);
  const Wa = {
    __name: "farming",
    setup(t) {
      return (e, n) => (K(), Me(za));
    },
  };
  typeof ge == "function" && ge(Wa);
  const qa = {
    __name: "contact",
    setup(t) {
      return (e, n) => (K(), Me(Ha));
    },
  };
  typeof ge == "function" && ge(qa);
  const Ka = {
    __name: "about",
    setup(t) {
      return (e, n) => (K(), Me(Da));
    },
  };
  typeof ge == "function" && ge(Ka);
  const Zm = { class: "section" },
    Ya = tt(
      {
        __name: "NewsDetail",
        setup(t) {
          const e = js();
          return (n, s) => (
            K(),
            oe("section", Zm, [
              v("h1", null, "新闻详情 #" + _e(te(e).params.id), 1),
              s[0] ||
                (s[0] = v(
                  "p",
                  null,
                  "这里展示新闻的标题、封面、正文内容（占位）。",
                  -1
                )),
            ])
          );
        },
      },
      [["__scopeId", "data-v-9b913785"]]
    ),
    Qa = {
      __name: "[id]",
      setup(t) {
        return (e, n) => (K(), Me(Ya));
      },
    };
  typeof ge == "function" && ge(Qa);
  const Xa = {
    __name: "[id]",
    setup(t) {
      return (e, n) => (K(), Me(Ya));
    },
  };
  typeof ge == "function" && ge(Xa);
  const ev = [
    {
      name: "zh-cn-news",
      path: "/zh-cn/news",
      component: Pa,
      props: !0,
      meta: { title: "新闻动态 - 连深海洋", language: "zh-cn" },
    },
    {
      name: "en-news",
      path: "/en/news",
      component: La,
      props: !0,
      meta: { title: "News - Lianshen Marine", language: "en" },
    },
    {
      name: "zh-cn-research",
      path: "/zh-cn/research",
      component: Oa,
      props: !0,
      meta: { title: "科研平台 - 连深海洋", language: "zh-cn" },
    },
    {
      name: "zh-cn-products",
      path: "/zh-cn/products",
      component: Ra,
      props: !0,
      meta: { title: "产品中心 - 连深海洋", language: "zh-cn" },
    },
    {
      name: "zh-cn-home",
      path: "/zh-cn",
      component: $a,
      props: !0,
      meta: { title: "首页 - 连深海洋", language: "zh-cn" },
    },
    {
      name: "zh-cn-farming",
      path: "/zh-cn/farming",
      component: Na,
      props: !0,
      meta: { title: "养殖模式 - 连深海洋", language: "zh-cn" },
    },
    {
      name: "zh-cn-contact",
      path: "/zh-cn/contact",
      component: Fa,
      props: !0,
      meta: { title: "联系我们 - 连深海洋", language: "zh-cn" },
    },
    {
      name: "zh-cn-about",
      path: "/zh-cn/about",
      component: Ga,
      props: !0,
      meta: { title: "关于我们 - 连深海洋", language: "zh-cn" },
    },
    {
      name: "en-research",
      path: "/en/research",
      component: ja,
      props: !0,
      meta: { title: "Research Platform - Lianshen Marine", language: "en" },
    },
    {
      name: "en-products",
      path: "/en/products",
      component: Va,
      props: !0,
      meta: { title: "Products - Lianshen Marine", language: "en" },
    },
    {
      name: "en-home",
      path: "/en",
      component: Ua,
      props: !0,
      meta: { title: "Home - Lianshen Marine", language: "en" },
    },
    {
      name: "en-farming",
      path: "/en/farming",
      component: Wa,
      props: !0,
      meta: { title: "Aquaculture Models - Lianshen Marine", language: "en" },
    },
    {
      name: "en-contact",
      path: "/en/contact",
      component: qa,
      props: !0,
      meta: {
        title: "Contact & Cooperation - Lianshen Marine",
        language: "en",
      },
    },
    {
      name: "en-about",
      path: "/en/about",
      component: Ka,
      props: !0,
      meta: { title: "About Us - Lianshen Marine", language: "en" },
    },
    {
      name: "news-detail",
      path: "/en/news/:id",
      component: Qa,
      props: !0,
      meta: { title: "News Detail - Lianshen Marine", language: "en" },
    },
    {
      name: "news-detail",
      path: "/zh-cn/news/:id",
      component: Xa,
      props: !0,
      meta: { title: "新闻详情 - 连深海洋", language: "zh-cn" },
    },
  ];
  function tv(t = 1024) {
    const e = ae(!1),
      n = () => {
        e.value = window.innerWidth < t;
      };
    return (
      It(() => {
        n(), window.addEventListener("resize", n);
      }),
      Gt(() => {
        window.removeEventListener("resize", n);
      }),
      { isMobile: e }
    );
  }
  const nv = { class: "m-footer" },
    sv = { class: "m-foot-wrap" },
    iv = { class: "top-section" },
    rv = { class: "m-links" },
    ov = { class: "col" },
    lv = { class: "col" },
    av = { class: "col" },
    Ja = tt(
      {
        __name: "SiteFooter",
        setup(t) {
          function e() {
            try {
              [
                document.scrollingElement,
                document.documentElement,
                document.body,
                document.querySelector(".pc-main"),
                document.querySelector(".m-main"),
              ]
                .filter(Boolean)
                .forEach((s) => {
                  try {
                    s.scrollTop = 0;
                  } catch (i) {}
                }),
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            } catch (n) {
              window.scrollTo(0, 0);
            }
          }
          return (n, s) => {
            const i = yn("router-link");
            return (
              K(),
              oe("footer", nv, [
                v("div", sv, [
                  v("div", iv, [
                    s[7] ||
                      (s[7] = v(
                        "div",
                        { class: "m-brand" },
                        [
                          v("div", { class: "logo" }, "连深海洋"),
                          v("div", { class: "sub" }, "LIANSHEN MARINE"),
                        ],
                        -1
                      )),
                    v("nav", rv, [
                      v("div", ov, [
                        Z(
                          i,
                          { to: "/", onClick: e },
                          {
                            default: ce(() => [
                              ...(s[0] || (s[0] = [Pe("首页", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        Z(
                          i,
                          { to: "/about", onClick: e },
                          {
                            default: ce(() => [
                              ...(s[1] || (s[1] = [Pe("关于我们", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        Z(
                          i,
                          { to: "/farming", onClick: e },
                          {
                            default: ce(() => [
                              ...(s[2] || (s[2] = [Pe("养殖模式", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                      ]),
                      v("div", lv, [
                        Z(
                          i,
                          { to: "/research", onClick: e },
                          {
                            default: ce(() => [
                              ...(s[3] || (s[3] = [Pe("科研平台", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        Z(
                          i,
                          { to: "/products", onClick: e },
                          {
                            default: ce(() => [
                              ...(s[4] || (s[4] = [Pe("产品中心", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        Z(
                          i,
                          { to: "/news", onClick: e },
                          {
                            default: ce(() => [
                              ...(s[5] || (s[5] = [Pe("新闻动态", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                      ]),
                      v("div", av, [
                        v("a", { href: "/about#join", onClick: e }, "加入我们"),
                        Z(
                          i,
                          { to: "/contact", onClick: e },
                          {
                            default: ce(() => [
                              ...(s[6] || (s[6] = [Pe("联系合作", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                      ]),
                    ]),
                    s[8] ||
                      (s[8] = Ut(
                        '<div class="m-social" data-v-e7d68f9b><span data-v-e7d68f9b>Follow our social media</span><div class="icons" data-v-e7d68f9b><a href="#" aria-label="wechat" class="wechat-icon" data-v-e7d68f9b><svg viewBox="0 0 24 24" width="14" height="14" data-v-e7d68f9b><path d="M8.5 12c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5z" fill="currentColor" data-v-e7d68f9b></path><path d="M12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.3 1.1 4.7L2 22l5.3-1.1C8.7 21.6 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" fill="currentColor" data-v-e7d68f9b></path></svg></a><a href="#" aria-label="weibo" class="weibo-icon" data-v-e7d68f9b><svg viewBox="0 0 24 24" width="14" height="14" data-v-e7d68f9b><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 17.9c-4.4-.4-7.9-4-7.9-8.4 0-4.4 3.5-8 7.9-8.4v16.8zm2 0V3.1c4.4.4 7.9 4 7.9 8.4 0 4.4-3.5 8-7.9 8.4z" fill="currentColor" data-v-e7d68f9b></path></svg></a><a href="#" aria-label="linkedin" class="linkedin-icon" data-v-e7d68f9b><svg viewBox="0 0 24 24" width="14" height="14" data-v-e7d68f9b><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" fill="currentColor" data-v-e7d68f9b></path></svg></a><a href="#" aria-label="youtube" class="youtube-icon" data-v-e7d68f9b><svg viewBox="0 0 24 24" width="14" height="14" data-v-e7d68f9b><path d="M23.5 6.5c-.3-1.1-1.2-1.8-2.3-1.8C19.4 4.5 12 4.5 12 4.5s-7.4 0-9.2.2c-1.1.1-2 .7-2.3 1.8C.2 8.4.2 12 .2 12s0 3.6.2 5.5c.3 1.1 1.2 1.8 2.3 1.8 1.8.2 9.2.2 9.2.2s7.4 0 9.2-.2c1.1-.1 2-.7 2.3-1.8.2-1.9.2-5.5.2-5.5s0-3.6-.2-5.5zM9.5 15.5V8.5l6 3.5-6 3.5z" fill="currentColor" data-v-e7d68f9b></path></svg></a></div></div>',
                        1
                      )),
                  ]),
                  s[9] ||
                    (s[9] = Ut(
                      '<div class="m-divider" data-v-e7d68f9b></div><div class="search-copy-section" data-v-e7d68f9b><div class="m-search" data-v-e7d68f9b><input placeholder="请输入关键字..." data-v-e7d68f9b><span data-v-e7d68f9b>→</span></div><div class="m-copy" data-v-e7d68f9b><span data-v-e7d68f9b>Copyright 2025 © lianshen marine</span><div class="links" data-v-e7d68f9b><a href="#" data-v-e7d68f9b>使用条款</a><a href="#" data-v-e7d68f9b>网站地图</a></div></div></div>',
                      2
                    )),
                ]),
              ])
            );
          };
        },
      },
      [["__scopeId", "data-v-e7d68f9b"]]
    ),
    os = {
      "zh-cn": { name: "简体中文", code: "zh-cn", path: "/zh-cn" },
      en: { name: "English", code: "en", path: "/en" },
    },
    ls = "zh-cn",
    wt = ae(ls);
  function Qs() {
    const t = oa(),
      e = js(),
      n = () =>
        (typeof window != "undefined" &&
          localStorage.getItem("site-language")) ||
        ls,
      s = (f) => {
        typeof window != "undefined" &&
          localStorage.setItem("site-language", f);
      },
      i = (f) => {
        const p = f.split("/").filter(Boolean);
        if (p.length > 0) {
          const h = p[0];
          if (os[h]) return h;
        }
        return ls;
      },
      r = (f) => {
        const p = f.split("/").filter(Boolean);
        return p.length > 0 && os[p[0]] ? "/" + p.slice(1).join("/") : f;
      },
      o = (f, p = wt.value) => {
        const h = r(f);
        return `/${p}${h === "/" ? "" : h}`;
      },
      l = (f) => {
        if (!os[f]) {
          console.warn(`不支持的语言: ${f}`);
          return;
        }
        wt.value, (wt.value = f), s(f);
        const p = e.path,
          h = r(p),
          m = o(h, f);
        t.replace(m);
      },
      a = () => {
        const f = n(),
          p = i(e.path),
          h = p !== ls ? p : f;
        (wt.value = h), s(h);
      };
    jt(
      () => e.path,
      (f) => {
        const p = i(f);
        p !== wt.value && ((wt.value = p), s(p));
      }
    );
    const u = ze(() => os[wt.value]),
      c = ze(() => wt.value === "zh-cn"),
      d = ze(() => wt.value === "en");
    return {
      currentLanguage: wt,
      currentLangInfo: u,
      isChinese: c,
      isEnglish: d,
      supportedLanguages: os,
      switchLanguage: l,
      initializeLanguage: a,
      addLanguageToPath: o,
      removeLanguageFromPath: r,
      getLanguageFromPath: i,
    };
  }
  const cv = {
      name: "PcNav",
      setup() {
        const {
          currentLanguage: t,
          switchLanguage: e,
          addLanguageToPath: n,
        } = Qs();
        return {
          currentLanguage: t,
          switchLanguage: e,
          getLocalizedPath: (i) => n(i, t.value),
        };
      },
    },
    dv = { class: "pc-nav" },
    uv = { class: "pc-nav__left" },
    fv = { class: "pc-nav__right" },
    pv = { class: "pc-nav__menu" },
    hv = { class: "language-switch" };
  function gv(t, e, n, s, i, r) {
    const o = yn("router-link");
    return (
      K(),
      oe("nav", dv, [
        v("div", uv, [
          Z(
            o,
            { to: s.getLocalizedPath("/"), class: "logo" },
            {
              default: ce(() => [
                ...(e[2] ||
                  (e[2] = [
                    v("div", { class: "logo-main" }, "连深海洋", -1),
                    v("div", { class: "logo-sub" }, "LIANSHEN MARINE", -1),
                  ])),
              ]),
              _: 1,
            },
            8,
            ["to"]
          ),
        ]),
        v("div", fv, [
          v("ul", pv, [
            v("li", null, [
              Z(
                o,
                { to: s.getLocalizedPath("/") },
                {
                  default: ce(() => [...(e[3] || (e[3] = [Pe("首页", -1)]))]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
            v("li", null, [
              Z(
                o,
                { to: s.getLocalizedPath("/about") },
                {
                  default: ce(() => [
                    ...(e[4] || (e[4] = [Pe("关于我们", -1)])),
                  ]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
            v("li", null, [
              Z(
                o,
                { to: s.getLocalizedPath("/farming") },
                {
                  default: ce(() => [
                    ...(e[5] || (e[5] = [Pe("养殖模式", -1)])),
                  ]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
            v("li", null, [
              Z(
                o,
                { to: s.getLocalizedPath("/research") },
                {
                  default: ce(() => [
                    ...(e[6] || (e[6] = [Pe("科研平台", -1)])),
                  ]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
            v("li", null, [
              Z(
                o,
                { to: s.getLocalizedPath("/products") },
                {
                  default: ce(() => [
                    ...(e[7] || (e[7] = [Pe("产品中心", -1)])),
                  ]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
            v("li", null, [
              Z(
                o,
                { to: s.getLocalizedPath("/news") },
                {
                  default: ce(() => [
                    ...(e[8] || (e[8] = [Pe("新闻动态", -1)])),
                  ]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
            v("li", null, [
              Z(
                o,
                { to: s.getLocalizedPath("/contact") },
                {
                  default: ce(() => [
                    ...(e[9] || (e[9] = [Pe("联系合作", -1)])),
                  ]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
          ]),
          v("div", hv, [
            v(
              "button",
              {
                class: De([
                  "lang-btn",
                  { active: s.currentLanguage === "zh-cn" },
                ]),
                onClick: e[0] || (e[0] = (l) => s.switchLanguage("zh-cn")),
              },
              " CN ",
              2
            ),
            e[10] || (e[10] = v("span", { class: "lang-divider" }, "|", -1)),
            v(
              "button",
              {
                class: De(["lang-btn", { active: s.currentLanguage === "en" }]),
                onClick: e[1] || (e[1] = (l) => s.switchLanguage("en")),
              },
              " EN ",
              2
            ),
          ]),
        ]),
      ])
    );
  }
  const mv = tt(cv, [
      ["render", gv],
      ["__scopeId", "data-v-4c615095"],
    ]),
    vv = { class: "pc-container" },
    yv = tt(
      {
        __name: "PcLayout",
        setup(t) {
          const e = ae(!1),
            n = ae(0);
          let s = !1;
          const i = ae(!0);
          let r = null;
          const o = js(),
            { initializeLanguage: l } = Qs();
          function a() {
            const c = window.scrollY || 0;
            s ||
              (window.requestAnimationFrame(() => {
                const d = c > n.value,
                  f = c > 20;
                d && f ? (e.value = !0) : (e.value = !1),
                  (n.value = c),
                  (s = !1);
              }),
              (s = !0));
          }
          It(() => {
            (n.value = window.scrollY || 0),
              window.addEventListener("scroll", a, { passive: !0 }),
              l(),
              u();
          }),
            Gt(() => {
              window.removeEventListener("scroll", a),
                r && (r.disconnect(), (r = null));
            }),
            jt(
              () => o.fullPath,
              () =>
                Tt(null, null, function* () {
                  yield Bn(), u();
                })
            );
          function u() {
            r && r.disconnect();
            const c = document.querySelector(
              '.hero, .page-hero, [data-hero], section[role="img"]'
            );
            if (!c) {
              i.value = !1;
              return;
            }
            const d = document.querySelector(".pc-header"),
              f = d ? d.offsetHeight : 0;
            (r = new IntersectionObserver(
              (p) => {
                const h = p[0];
                i.value = !!h.isIntersecting;
              },
              { root: null, threshold: 0, rootMargin: `-${f}px 0px 0px 0px` }
            )),
              r.observe(c);
          }
          return (c, d) => {
            const f = yn("router-view");
            return (
              K(),
              oe("div", vv, [
                v(
                  "header",
                  {
                    class: De([
                      "pc-header",
                      { "is-hidden": e.value, "is-transparent": i.value },
                    ]),
                  },
                  [Z(mv)],
                  2
                ),
                v(
                  "main",
                  { class: De(["pc-main", { compact: e.value }]) },
                  [Z(f)],
                  2
                ),
                Z(Ja),
              ])
            );
          };
        },
      },
      [["__scopeId", "data-v-36d2d450"]]
    ),
    bv = {
      name: "MobileNav",
      setup() {
        const {
            currentLanguage: t,
            switchLanguage: e,
            addLanguageToPath: n,
          } = Qs(),
          s = ae(!1),
          i = (a) => n(a, t.value),
          r = () => {
            (s.value = !0),
              (document.documentElement.style.overflow = "hidden");
          },
          o = () => {
            (s.value = !1), (document.documentElement.style.overflow = "");
          },
          l = (a) => {
            e(a), o();
          };
        return (
          Gt(() => {
            document.documentElement.style.overflow = "";
          }),
          {
            currentLanguage: t,
            switchLanguage: e,
            getLocalizedPath: i,
            isMenuOpen: s,
            openMenu: r,
            closeMenu: o,
            switchLanguageAndClose: l,
          }
        );
      },
    },
    wv = { class: "m-nav" },
    _v = { class: "m-nav__left" },
    Sv = { class: "m-nav__right" },
    Ev = { class: "language-switch" },
    xv = { key: 0, class: "drawer", role: "dialog", "aria-modal": "true" },
    Tv = { class: "drawer__header" },
    Cv = { class: "drawer__menu" },
    Av = { class: "drawer__lang" };
  function Mv(t, e, n, s, i, r) {
    const o = yn("router-link");
    return (
      K(),
      oe(
        he,
        null,
        [
          v("nav", wv, [
            v("div", _v, [
              Z(
                o,
                { to: s.getLocalizedPath("/"), class: "logo" },
                {
                  default: ce(() => [
                    ...(e[7] ||
                      (e[7] = [
                        v("div", { class: "logo-main" }, "连深海洋", -1),
                        v("div", { class: "logo-sub" }, "LIANSHEN MARINE", -1),
                      ])),
                  ]),
                  _: 1,
                },
                8,
                ["to"]
              ),
            ]),
            v("div", Sv, [
              v("div", Ev, [
                v(
                  "button",
                  {
                    class: De([
                      "lang-btn",
                      { active: s.currentLanguage === "zh-cn" },
                    ]),
                    onClick: e[0] || (e[0] = (l) => s.switchLanguage("zh-cn")),
                  },
                  " CN ",
                  2
                ),
                e[8] || (e[8] = v("span", { class: "lang-divider" }, "|", -1)),
                v(
                  "button",
                  {
                    class: De([
                      "lang-btn",
                      { active: s.currentLanguage === "en" },
                    ]),
                    onClick: e[1] || (e[1] = (l) => s.switchLanguage("en")),
                  },
                  " EN ",
                  2
                ),
              ]),
              v(
                "button",
                {
                  class: "hamburger",
                  "aria-label": "打开菜单",
                  onClick:
                    e[2] || (e[2] = (...l) => s.openMenu && s.openMenu(...l)),
                },
                [
                  ...(e[9] ||
                    (e[9] = [
                      v("span", null, null, -1),
                      v("span", null, null, -1),
                      v("span", null, null, -1),
                    ])),
                ]
              ),
            ]),
          ]),
          (K(),
          Me(md, { to: "body" }, [
            Z(
              hl,
              { name: "drawer-fade" },
              {
                default: ce(() => [
                  s.isMenuOpen
                    ? (K(),
                      oe("div", {
                        key: 0,
                        class: "drawer-overlay",
                        onClick:
                          e[3] ||
                          (e[3] = (...l) => s.closeMenu && s.closeMenu(...l)),
                      }))
                    : Un("", !0),
                ]),
                _: 1,
              }
            ),
            Z(
              hl,
              { name: "drawer-slide" },
              {
                default: ce(() => [
                  s.isMenuOpen
                    ? (K(),
                      oe("aside", xv, [
                        v("div", Tv, [
                          v(
                            "button",
                            {
                              class: "drawer__close",
                              "aria-label": "关闭菜单",
                              onClick:
                                e[4] ||
                                (e[4] = (...l) =>
                                  s.closeMenu && s.closeMenu(...l)),
                            },
                            "×"
                          ),
                        ]),
                        v("ul", Cv, [
                          v("li", null, [
                            Z(
                              o,
                              {
                                onClick: s.closeMenu,
                                to: s.getLocalizedPath("/"),
                              },
                              {
                                default: ce(() => [
                                  ...(e[10] || (e[10] = [Pe("首页", -1)])),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick", "to"]
                            ),
                          ]),
                          v("li", null, [
                            Z(
                              o,
                              {
                                onClick: s.closeMenu,
                                to: s.getLocalizedPath("/about"),
                              },
                              {
                                default: ce(() => [
                                  ...(e[11] || (e[11] = [Pe("关于我们", -1)])),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick", "to"]
                            ),
                          ]),
                          v("li", null, [
                            Z(
                              o,
                              {
                                onClick: s.closeMenu,
                                to: s.getLocalizedPath("/farming"),
                              },
                              {
                                default: ce(() => [
                                  ...(e[12] || (e[12] = [Pe("养殖模式", -1)])),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick", "to"]
                            ),
                          ]),
                          v("li", null, [
                            Z(
                              o,
                              {
                                onClick: s.closeMenu,
                                to: s.getLocalizedPath("/research"),
                              },
                              {
                                default: ce(() => [
                                  ...(e[13] || (e[13] = [Pe("科研平台", -1)])),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick", "to"]
                            ),
                          ]),
                          v("li", null, [
                            Z(
                              o,
                              {
                                onClick: s.closeMenu,
                                to: s.getLocalizedPath("/products"),
                              },
                              {
                                default: ce(() => [
                                  ...(e[14] || (e[14] = [Pe("产品中心", -1)])),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick", "to"]
                            ),
                          ]),
                          v("li", null, [
                            Z(
                              o,
                              {
                                onClick: s.closeMenu,
                                to: s.getLocalizedPath("/news"),
                              },
                              {
                                default: ce(() => [
                                  ...(e[15] || (e[15] = [Pe("新闻动态", -1)])),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick", "to"]
                            ),
                          ]),
                          v("li", null, [
                            Z(
                              o,
                              {
                                onClick: s.closeMenu,
                                to: s.getLocalizedPath("/contact"),
                              },
                              {
                                default: ce(() => [
                                  ...(e[16] || (e[16] = [Pe("联系合作", -1)])),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick", "to"]
                            ),
                          ]),
                        ]),
                        v("div", Av, [
                          v(
                            "button",
                            {
                              class: De([
                                "lang-btn",
                                { active: s.currentLanguage === "zh-cn" },
                              ]),
                              onClick:
                                e[5] ||
                                (e[5] = (l) =>
                                  s.switchLanguageAndClose("zh-cn")),
                            },
                            "简体",
                            2
                          ),
                          e[17] ||
                            (e[17] = v(
                              "span",
                              { class: "lang-divider" },
                              "|",
                              -1
                            )),
                          v(
                            "button",
                            {
                              class: De([
                                "lang-btn",
                                { active: s.currentLanguage === "en" },
                              ]),
                              onClick:
                                e[6] ||
                                (e[6] = (l) => s.switchLanguageAndClose("en")),
                            },
                            "English",
                            2
                          ),
                        ]),
                      ]))
                    : Un("", !0),
                ]),
                _: 1,
              }
            ),
          ])),
        ],
        64
      )
    );
  }
  const Pv = tt(bv, [
      ["render", Mv],
      ["__scopeId", "data-v-96127a15"],
    ]),
    Lv = { class: "m-container" },
    Iv = tt(
      {
        __name: "MobileLayout",
        setup(t) {
          const e = ae(!1),
            n = ae(0);
          let s = !1;
          const i = ae(!0);
          let r = null;
          const o = js(),
            { initializeLanguage: l } = Qs();
          function a() {
            const c = window.scrollY || 0;
            s ||
              (window.requestAnimationFrame(() => {
                const d = c > n.value,
                  f = c > 20;
                d && f ? (e.value = !0) : (e.value = !1),
                  (n.value = c),
                  (s = !1);
              }),
              (s = !0));
          }
          It(() => {
            (n.value = window.scrollY || 0),
              window.addEventListener("scroll", a, { passive: !0 }),
              l(),
              u();
          }),
            Gt(() => {
              window.removeEventListener("scroll", a),
                r && (r.disconnect(), (r = null));
            }),
            jt(
              () => o.fullPath,
              () =>
                Tt(null, null, function* () {
                  yield Bn(), u();
                })
            );
          function u() {
            r && r.disconnect();
            const c = document.querySelector(
              '.hero, .page-hero, [data-hero], section[role="img"]'
            );
            if (!c) {
              i.value = !1;
              return;
            }
            const d = document.querySelector(".m-header"),
              f = d ? d.offsetHeight : 0;
            (r = new IntersectionObserver(
              (p) => {
                const h = p[0];
                i.value = !!h.isIntersecting;
              },
              { root: null, threshold: 0, rootMargin: `-${f}px 0px 0px 0px` }
            )),
              r.observe(c);
          }
          return (c, d) => {
            const f = yn("router-view");
            return (
              K(),
              oe("div", Lv, [
                v(
                  "header",
                  {
                    class: De([
                      "m-header",
                      { "is-hidden": e.value, "is-transparent": i.value },
                    ]),
                  },
                  [Z(Pv)],
                  2
                ),
                v(
                  "main",
                  { class: De(["m-main", { compact: e.value }]) },
                  [Z(f)],
                  2
                ),
                Z(Ja),
              ])
            );
          };
        },
      },
      [["__scopeId", "data-v-d2e9f48d"]]
    );
  sp(
    {
      __name: "App",
      setup(t) {
        const { isMobile: e } = tv(1024);
        return (n, s) => (K(), Me(Md(te(e) ? Iv : yv)));
      },
    },
    {
      base: "./",
      routerOptions: { history: "hash" },
      routes: [{ path: "/", redirect: "/zh-cn/" }, ...ev],
      scrollBehavior(t, e, n) {
        return n || { left: 0, top: 0 };
      },
    },
    ({ router: t }) => {
      t.afterEach((e) => {
        var s, i, r;
        if (typeof window == "undefined") return;
        (s = e.meta) != null && s.title
          ? (document.title = e.meta.title)
          : (((i = e.meta) == null ? void 0 : i.language) || "zh-cn") === "en"
          ? (document.title = "Lianshen Marine - Marine Aquaculture")
          : (document.title = "连深海洋 - 海洋养殖"),
          typeof document != "undefined" &&
            (document.documentElement.lang =
              ((r = e.meta) == null ? void 0 : r.language) || "zh-cn"),
          requestAnimationFrame(() => {
            try {
              window.scrollTo({ top: 0, left: 0, behavior: "auto" }),
                (document.documentElement.scrollTop = 0),
                (document.body.scrollTop = 0),
                document.querySelectorAll(".pc-main, .m-main").forEach((l) => {
                  l.scrollTop = 0;
                });
            } catch (o) {}
          });
      });
    }
  );
  function Ov(t) {
    return t &&
      t.__esModule &&
      Object.prototype.hasOwnProperty.call(t, "default")
      ? t.default
      : t;
  }
  var Xs = { exports: {} },
    kv = Xs.exports,
    Za;
  function Rv() {
    return (
      Za ||
        ((Za = 1),
        (function (t, e) {
          (function (n, s) {
            t.exports = s();
          })(kv, function () {
            function n(d) {
              var f = [];
              return (
                d.AMapUI && f.push(s(d.AMapUI)),
                d.Loca && f.push(i(d.Loca)),
                Promise.all(f)
              );
            }
            function s(d) {
              return new Promise(function (f, p) {
                var h = [];
                if (d.plugins)
                  for (var m = 0; m < d.plugins.length; m += 1)
                    o.AMapUI.plugins.indexOf(d.plugins[m]) == -1 &&
                      h.push(d.plugins[m]);
                if (l.AMapUI === r.failed) p("前次请求 AMapUI 失败");
                else if (l.AMapUI === r.notload) {
                  (l.AMapUI = r.loading),
                    (o.AMapUI.version = d.version || o.AMapUI.version),
                    (m = o.AMapUI.version);
                  var b = document.body || document.head,
                    w = document.createElement("script");
                  (w.type = "text/javascript"),
                    (w.src = "https://webapi.amap.com/ui/" + m + "/main.js"),
                    (w.onerror = function (g) {
                      (l.AMapUI = r.failed), p("请求 AMapUI 失败");
                    }),
                    (w.onload = function () {
                      if (((l.AMapUI = r.loaded), h.length))
                        window.AMapUI.loadUI(h, function () {
                          for (var g = 0, y = h.length; g < y; g++) {
                            var E = h[g].split("/").slice(-1)[0];
                            window.AMapUI[E] = arguments[g];
                          }
                          for (f(); a.AMapUI.length; )
                            a.AMapUI.splice(0, 1)[0]();
                        });
                      else
                        for (f(); a.AMapUI.length; ) a.AMapUI.splice(0, 1)[0]();
                    }),
                    b.appendChild(w);
                } else
                  l.AMapUI === r.loaded
                    ? d.version && d.version !== o.AMapUI.version
                      ? p("不允许多个版本 AMapUI 混用")
                      : h.length
                      ? window.AMapUI.loadUI(h, function () {
                          for (var g = 0, y = h.length; g < y; g++) {
                            var E = h[g].split("/").slice(-1)[0];
                            window.AMapUI[E] = arguments[g];
                          }
                          f();
                        })
                      : f()
                    : d.version && d.version !== o.AMapUI.version
                    ? p("不允许多个版本 AMapUI 混用")
                    : a.AMapUI.push(function (g) {
                        g
                          ? p(g)
                          : h.length
                          ? window.AMapUI.loadUI(h, function () {
                              for (var y = 0, E = h.length; y < E; y++) {
                                var C = h[y].split("/").slice(-1)[0];
                                window.AMapUI[C] = arguments[y];
                              }
                              f();
                            })
                          : f();
                      });
              });
            }
            function i(d) {
              return new Promise(function (f, p) {
                if (l.Loca === r.failed) p("前次请求 Loca 失败");
                else if (l.Loca === r.notload) {
                  (l.Loca = r.loading),
                    (o.Loca.version = d.version || o.Loca.version);
                  var h = o.Loca.version,
                    m = o.AMap.version.startsWith("2"),
                    b = h.startsWith("2");
                  if ((m && !b) || (!m && b)) p("JSAPI 与 Loca 版本不对应！！");
                  else {
                    (m = o.key), (b = document.body || document.head);
                    var w = document.createElement("script");
                    (w.type = "text/javascript"),
                      (w.src =
                        "https://webapi.amap.com/loca?v=" + h + "&key=" + m),
                      (w.onerror = function (g) {
                        (l.Loca = r.failed), p("请求 AMapUI 失败");
                      }),
                      (w.onload = function () {
                        for (l.Loca = r.loaded, f(); a.Loca.length; )
                          a.Loca.splice(0, 1)[0]();
                      }),
                      b.appendChild(w);
                  }
                } else
                  l.Loca === r.loaded
                    ? d.version && d.version !== o.Loca.version
                      ? p("不允许多个版本 Loca 混用")
                      : f()
                    : d.version && d.version !== o.Loca.version
                    ? p("不允许多个版本 Loca 混用")
                    : a.Loca.push(function (g) {
                        g ? p(g) : p();
                      });
              });
            }
            if (!window) throw Error("AMap JSAPI can only be used in Browser.");
            var r;
            (function (d) {
              (d.notload = "notload"),
                (d.loading = "loading"),
                (d.loaded = "loaded"),
                (d.failed = "failed");
            })(r || (r = {}));
            var o = {
                key: "",
                AMap: { version: "1.4.15", plugins: [] },
                AMapUI: { version: "1.1", plugins: [] },
                Loca: { version: "1.3.2" },
              },
              l = { AMap: r.notload, AMapUI: r.notload, Loca: r.notload },
              a = { AMapUI: [], Loca: [] },
              u = [],
              c = function (d) {
                typeof d == "function" &&
                  (l.AMap === r.loaded ? d(window.AMap) : u.push(d));
              };
            return {
              load: function (d) {
                return new Promise(function (f, p) {
                  if (l.AMap == r.failed) p("");
                  else if (l.AMap == r.notload) {
                    var h = d.key,
                      m = d.version,
                      b = d.plugins;
                    h
                      ? (window.AMap &&
                          location.host !== "lbs.amap.com" &&
                          p("禁止多种API加载方式混用"),
                        (o.key = h),
                        (o.AMap.version = m || o.AMap.version),
                        (o.AMap.plugins = b || o.AMap.plugins),
                        (l.AMap = r.loading),
                        (m = document.body || document.head),
                        (window.___onAPILoaded = function (g) {
                          if ((delete window.___onAPILoaded, g))
                            (l.AMap = r.failed), p(g);
                          else
                            for (
                              l.AMap = r.loaded,
                                n(d)
                                  .then(function () {
                                    f(window.AMap);
                                  })
                                  .catch(p);
                              u.length;

                            )
                              u.splice(0, 1)[0]();
                        }),
                        (b = document.createElement("script")),
                        (b.type = "text/javascript"),
                        (b.src =
                          "https://webapi.amap.com/maps?callback=___onAPILoaded&v=" +
                          o.AMap.version +
                          "&key=" +
                          h +
                          "&plugin=" +
                          o.AMap.plugins.join(",")),
                        (b.onerror = function (g) {
                          (l.AMap = r.failed), p(g);
                        }),
                        m.appendChild(b))
                      : p("请填写key");
                  } else if (l.AMap == r.loaded)
                    if (d.key && d.key !== o.key) p("多个不一致的 key");
                    else if (d.version && d.version !== o.AMap.version)
                      p("不允许多个版本 JSAPI 混用");
                    else {
                      if (((h = []), d.plugins))
                        for (m = 0; m < d.plugins.length; m += 1)
                          o.AMap.plugins.indexOf(d.plugins[m]) == -1 &&
                            h.push(d.plugins[m]);
                      h.length
                        ? window.AMap.plugin(h, function () {
                            n(d)
                              .then(function () {
                                f(window.AMap);
                              })
                              .catch(p);
                          })
                        : n(d)
                            .then(function () {
                              f(window.AMap);
                            })
                            .catch(p);
                    }
                  else if (d.key && d.key !== o.key) p("多个不一致的 key");
                  else if (d.version && d.version !== o.AMap.version)
                    p("不允许多个版本 JSAPI 混用");
                  else {
                    var w = [];
                    if (d.plugins)
                      for (m = 0; m < d.plugins.length; m += 1)
                        o.AMap.plugins.indexOf(d.plugins[m]) == -1 &&
                          w.push(d.plugins[m]);
                    c(function () {
                      w.length
                        ? window.AMap.plugin(w, function () {
                            n(d)
                              .then(function () {
                                f(window.AMap);
                              })
                              .catch(p);
                          })
                        : n(d)
                            .then(function () {
                              f(window.AMap);
                            })
                            .catch(p);
                    });
                  }
                });
              },
              reset: function () {
                delete window.AMap,
                  delete window.AMapUI,
                  delete window.Loca,
                  (o = {
                    key: "",
                    AMap: { version: "1.4.15", plugins: [] },
                    AMapUI: { version: "1.1", plugins: [] },
                    Loca: { version: "1.3.2" },
                  }),
                  (l = { AMap: r.notload, AMapUI: r.notload, Loca: r.notload }),
                  (a = { AMap: [], AMapUI: [], Loca: [] });
              },
            };
          });
        })(Xs)),
      Xs.exports
    );
  }
  var Bv = Rv();
  const $v = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: Ov(Bv) },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
})();
