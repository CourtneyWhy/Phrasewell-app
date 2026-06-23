import { redirect } from "next/navigation";

export default async function CategoryRedirect({
  params,
}: {
  params: Promise<{ categoryId: string }> | { categoryId: string };
}) {
  const resolved = params instanceof Promise ? await params : params;
  redirect(`/app/category/${resolved.categoryId}`);
}
