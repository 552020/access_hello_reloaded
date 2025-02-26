import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Access Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <p>A role-based authentication demo using Internet Identity</p>
      </CardContent>
    </Card>
  );
}
