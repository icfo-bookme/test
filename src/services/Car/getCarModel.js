export default async function getCarModel() {
  const res = await fetch(`https://bookme.com.bd/admin/api/cars/model`, {
    cache: "no-store",
  });
  const packages = await res.json();
  return packages;
}