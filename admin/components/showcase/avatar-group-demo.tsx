"use client";

import { AvatarGroup, type AvatarGroupPerson } from "@/components/ui/avatar-group";
import { Specimen } from "@/components/showcase/specimen";

/**
 * Gallery-only wrapper. `AvatarGroup`'s add button takes a callback, which a
 * server component cannot pass, so the demo supplies one from the client.
 */
export function AvatarGroupDemo({ people }: { people: AvatarGroupPerson[] }) {
  const noop = () => {};

  return (
    <>
      <Specimen label="group">
        <AvatarGroup people={people} max={5} />
        <AvatarGroup people={people} max={5} size="sm" />
        <AvatarGroup people={people} max={5} size="xs" />
      </Specimen>
      <Specimen label="group — overflow and add">
        <AvatarGroup people={people} max={4} onAdd={noop} />
        <AvatarGroup people={people} max={7} onAdd={noop} size="sm" />
      </Specimen>
    </>
  );
}
