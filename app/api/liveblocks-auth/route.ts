import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs";

const liveblocks = new Liveblocks({
  secret: process.env.CONVEX_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  // console.log("AUTH_INFO", { user });

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  //   const board = await convex.query(api.board.get, { id: room });

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.firstName!,
      avatar: user.imageUrl,
    },
  });
  const { room } = await request.json();

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
