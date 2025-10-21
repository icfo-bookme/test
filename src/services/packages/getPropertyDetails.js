export default async function getPropertyDetails({ id }) {
  try {
    const res = await fetch(`https://bookme.com.bd/admin/api/tourpackages/propertydetails/${id}`);
    if (!res.ok) {
      return [];
    }

    let property;
    try {
      property = await res.json();
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return [];
    }
    if (
      property == null ||
      (typeof property === 'object' && Object.keys(property).length === 0)
    ) {
      return [];
    }

    return property;
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}
