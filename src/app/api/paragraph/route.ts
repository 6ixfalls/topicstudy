import { NextResponse } from "next/server";

export async function POST() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json({
        paragraph: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
    quis ipsum tincidunt, auctor metus a, condimentum enim.
    Pellentesque pellentesque nulla ac nibh accumsan consequat.
    Suspendisse vitae nunc at dolor rutrum scelerisque id ac ligula.
    Nulla gravida nibh a lorem sodales efficitur. Nunc posuere enim
    sit amet ultrices malesuada. Nunc ornare ultricies lacus et
    posuere. Donec sapien mauris, tincidunt nec suscipit in, mattis
    in urna. Curabitur lacinia molestie lorem. Curabitur est ex,
    scelerisque tempor sapien ac, bibendum sodales mi. Nam
    consectetur, nunc at aliquet interdum, massa urna scelerisque
    leo, in aliquam risus felis sit amet nunc. In tincidunt congue
    lorem vel aliquam. Proin diam ante, pharetra quis finibus
    rhoncus, aliquet vel nulla. Aliquam ut ante metus. Aenean eu
    odio elementum, congue nisl in, suscipit lacus. Ut scelerisque
    sapien ut ullamcorper viverra. Suspendisse potenti. Sed luctus
    neque quis mollis efficitur. Cras dignissim vulputate enim in
    cursus. Sed scelerisque, odio et iaculis eleifend, magna arcu
    vestibulum lorem, non condimentum velit velit sed eros.
    Pellentesque nec odio consequat, mattis felis cursus, faucibus
    augue. Nulla lobortis elit consequat aliquet feugiat. Fusce at
    sapien ac ligula pretium consequat. Cras ac nulla eu dolor
    maximus tincidunt. Mauris molestie nisi vitae justo feugiat, ut
    mattis purus malesuada. Nam molestie sit amet libero at rutrum.
    Morbi et venenatis ipsum. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit.`,
    });
}
