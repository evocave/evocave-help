import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface EnvatoProfile {
    username: string;
    email: string;
    image: string;
}

export default function EnvatoProvider<P extends EnvatoProfile>(
    options: OAuthUserConfig<P>,
): OAuthConfig<P> {
    return {
        id: "envato",
        name: "Envato",
        type: "oauth",
        issuer: "https://api.envato.com",
        authorization: {
            url: "https://api.envato.com/authorization",
            params: {
                response_type: "code",
                scope: "",
            },
        },
        token: {
            url: "https://api.envato.com/token",
            async request({ params, provider }: { params: any; provider: any }) {
                const res = await fetch("https://api.envato.com/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "authorization_code",
                        code: params.code!,
                        client_id: provider.clientId!,
                        client_secret: provider.clientSecret!,
                        redirect_uri: provider.callbackUrl!,
                    }),
                });
                const tokens = await res.json();
                return { tokens };
            },
        },
        userinfo: {
            url: "https://api.envato.com/v1/market/private/user/username.json",
            async request({ tokens }: { tokens: { access_token?: string } }) {
                const [usernameRes, emailRes, accountRes] = await Promise.all([
                    fetch("https://api.envato.com/v1/market/private/user/username.json", {
                        headers: { Authorization: `Bearer ${tokens.access_token}` },
                    }),
                    fetch("https://api.envato.com/v1/market/private/user/email.json", {
                        headers: { Authorization: `Bearer ${tokens.access_token}` },
                    }),
                    fetch("https://api.envato.com/v1/market/private/user/account.json", {
                        headers: { Authorization: `Bearer ${tokens.access_token}` },
                    }),
                ]);

                const [usernameData, emailData, accountData] = await Promise.all([
                    usernameRes.json(),
                    emailRes.json(),
                    accountRes.json(),
                ]);

                return {
                    username: usernameData.username,
                    email: emailData.email,
                    image: accountData.account?.image ?? null,
                };
            },
        },
        profile(profile) {
            return {
                id: profile.username,
                name: profile.username,
                email: profile.email,
                image: profile.image,
                envatoUsername: profile.username,
            };
        },
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        checks: ["state"],
    };
}
