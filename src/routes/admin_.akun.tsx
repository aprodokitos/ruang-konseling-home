import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Search, ShieldCheck, UserPlus, Users, X } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminNavigation } from "@/lib/admin-navigation";
import {
  CURRENT_ADMIN_ID, MAX_ACTIVE_ADMINS, changeRole, sampleAccounts, sampleRequests, toggleStatus, validateNewUser,
  type Account, type AccountRequest, type Role,
} from "@/lib/admin-accounts";

export const Route = createFileRoute("/admin_/akun")({
  head: () => ({ meta: [
    { title: "Kelola Akun & Role — RuangPulih Admin" },
    { name: "description", content: "Tambah pengguna, ubah role, nonaktifkan akun, dan proses pengajuan akun RuangPulih." },
    { property: "og:title", content: "Kelola Akun & Role — RuangPulih Admin" },
    { property: "og:description", content: "Pengelolaan akun Admin, Konselor, dan Mahasiswa RuangPulih." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: KelolaAkun,
});

const field = "mt-1.5 h-10 w-full rounded-md border bg-card px-3 text-sm";
const roles: Role[] = ["Admin", "Konselor", "Mahasiswa"];

function KelolaAkun() {
  const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
  const [requests, setRequests] = useState<AccountRequest[]>(sampleRequests);
  const [tab, setTab] = useState<"pengguna" | "pengajuan">("pengguna");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [notice, setNotice] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string; role: Role | "" }>({ name: "", email: "", role: "" });
  const error = validateNewUser(accounts, requests, form);

  const run = (fn: () => Account[], msg: string) => {
    try { setAccounts(fn()); setNotice(msg); } catch (e) { setNotice((e as Error).message); }
  };
  const rows = accounts.filter((a) => (roleFilter === "Semua" || a.role === roleFilter) && `${a.name} ${a.email}`.toLowerCase().includes(query.trim().toLowerCase()));
  const activeAdmins = accounts.filter((a) => a.role === "Admin" && a.status === "Aktif").length;
  const stats = [
    { label: "Total Pengguna", value: accounts.length },
    { label: "Admin Aktif", value: `${activeAdmins}/${MAX_ACTIVE_ADMINS}` },
    { label: "Konselor", value: accounts.filter((a) => a.role === "Konselor").length },
    { label: "Pengajuan Menunggu", value: requests.length },
  ];

  const save = () => {
    if (error || !form.role) return;
    setAccounts([...accounts, { id: `u${Date.now()}`, name: form.name.trim(), email: form.email.trim(), role: form.role, status: "Aktif", source: "Ditambahkan Admin" }]);
    setNotice(`${form.name.trim()} ditambahkan sebagai ${form.role} dan langsung aktif.`);
    setForm({ name: "", email: "", role: "" }); setConfirming(false); setAdding(false);
  };
  const decide = (r: AccountRequest, ok: boolean) => {
    setRequests(requests.filter((x) => x.id !== r.id));
    if (ok) setAccounts([...accounts, { id: `u${Date.now()}`, name: r.name, email: r.email, role: r.role, status: "Aktif", source: "Pengajuan Akun" }]);
    setNotice(ok ? `Pengajuan ${r.name} disetujui.` : `Pengajuan ${r.name} ditolak.`);
  };

  return <div className="counselor-portal">
    <Shell nav={adminNavigation.map((i) => i.label)} navigationItems={adminNavigation}>
      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-9">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Portal Admin</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Kelola Akun & Role</h1>
          <Button onClick={() => { setAdding(true); setConfirming(false); }}><UserPlus className="size-4" /> Tambah Pengguna</Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Tambah pengguna, ubah role, nonaktifkan akun, serta setujui atau tolak pengajuan akun.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((s) => <div key={s.label} className="rounded-lg border bg-card p-5"><p className="text-sm text-muted-foreground">{s.label}</p><p className="mt-3 text-3xl font-semibold tabular-nums">{s.value}</p></div>)}
        </div>

        {notice && <div role="status" className="mt-6 flex items-center justify-between gap-3 rounded-md border bg-secondary px-4 py-3 text-sm text-secondary-foreground"><span>{notice}</span><button aria-label="Tutup pesan" onClick={() => setNotice(null)}><X className="size-4" /></button></div>}

        <div className="mt-8 flex gap-1 border-b" role="tablist">
          {([["pengguna", "Daftar Pengguna", Users], ["pengajuan", `Pengajuan Akun (${requests.length})`, ShieldCheck]] as const).map(([k, label, Icon]) =>
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm ${tab === k ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}><Icon className="size-4" />{label}</button>)}
        </div>

        {tab === "pengguna" ? <>
          <div className="mt-5 flex flex-wrap gap-2">
            <label className="relative min-w-0 flex-1 sm:max-w-xs"><span className="sr-only">Cari pengguna</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau email…" className="h-10 w-full rounded-md border bg-card pl-9 pr-3 text-sm" /></label>
            <select aria-label="Filter role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-10 rounded-md border bg-card px-3 text-sm"><option value="Semua">Semua Role</option>{roles.map((r) => <option key={r}>{r}</option>)}</select>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Nama Lengkap</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Role</th><th className="px-4 py-3 font-medium">Asal Akun</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Aksi</th></tr></thead>
              <tbody>
                {rows.map((a) => { const self = a.id === CURRENT_ADMIN_ID; return <tr key={a.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{a.name}{self && <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">Anda</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.email}</td>
                  <td className="px-4 py-3"><select aria-label={`Role ${a.name}`} disabled={self} value={a.role} onChange={(e) => run(() => changeRole(accounts, a.id, e.target.value as Role), `Role ${a.name} diubah menjadi ${e.target.value}.`)} className="h-9 rounded-md border bg-background px-2 text-sm disabled:opacity-60">{roles.map((r) => <option key={r}>{r}</option>)}</select></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.source}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.status === "Aktif" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>{a.status}</span></td>
                  <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" disabled={self} title={self ? "Tidak dapat menonaktifkan akun sendiri" : undefined} onClick={() => run(() => toggleStatus(accounts, a.id), `Akun ${a.name} ${a.status === "Aktif" ? "dinonaktifkan" : "diaktifkan kembali"}.`)}>{a.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}</Button></td>
                </tr>; })}
                {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Tidak ada pengguna yang cocok.</td></tr>}
              </tbody>
            </table>
          </div>
        </> : <div className="mt-5 space-y-3">
          {requests.length === 0 && <p className="rounded-lg border bg-card px-4 py-10 text-center text-sm text-muted-foreground">Tidak ada pengajuan akun yang menunggu.</p>}
          {requests.map((r) => <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-5">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{r.name}</p><span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">{r.role}</span></div><p className="mt-1 text-sm text-muted-foreground">{r.email}</p><p className="mt-1 text-xs text-muted-foreground">{r.detail} · Diajukan {r.submitted}</p></div>
            <div className="flex gap-2"><Button variant="outline" onClick={() => decide(r, false)}><X className="size-4" /> Tolak</Button><Button onClick={() => decide(r, true)}><Check className="size-4" /> Setujui</Button></div>
          </div>)}
        </div>}
      </section>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="counselor-portal">
          <DialogHeader><DialogTitle>{confirming ? "Konfirmasi Pengguna Baru" : "Tambah Pengguna"}</DialogTitle><DialogDescription>{confirming ? "Periksa kembali email dan role. Email yang salah dapat memberi akses ke orang lain." : "Pengguna langsung aktif dan login lewat Google memakai email ini. Data lain dilengkapi di Profil."}</DialogDescription></DialogHeader>
          {confirming ? <dl className="space-y-3 rounded-md border bg-muted/40 p-4 text-sm">
            <div><dt className="text-xs text-muted-foreground">Nama lengkap</dt><dd className="font-medium">{form.name}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Email</dt><dd className="font-medium">{form.email}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Role</dt><dd className="font-medium">{form.role}</dd></div>
          </dl> : <div className="space-y-4">
            <label className="block text-sm font-medium">Nama lengkap<input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="block text-sm font-medium">Email Google<input type="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@upnvj.ac.id" /></label>
            <label className="block text-sm font-medium">Role<select className={field} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}><option value="">Pilih role…</option>{roles.map((r) => <option key={r}>{r}</option>)}</select></label>
            {error && (form.name || form.email || form.role) && <p className="text-sm text-destructive">{error}</p>}
          </div>}
          <DialogFooter>
            {confirming ? <><Button variant="outline" onClick={() => setConfirming(false)}>Ubah</Button><Button onClick={save}>Simpan Pengguna</Button></>
              : <><Button variant="outline" onClick={() => setAdding(false)}>Batal</Button><Button disabled={!!error} onClick={() => setConfirming(true)}>Lanjutkan</Button></>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  </div>;
}
