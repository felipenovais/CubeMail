import React, { useEffect, useState } from "react";

// Import Context
import EmailState from "./context/email/EmailState";

// Import Pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";

import { ThemeProvider, CSSReset } from "@chakra-ui/core";

const App = () => {
    const [isAuthorize, setIsAuthorize] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const initialGoogleConnection = async() => {
            await window.gapi.load('client');
            const client = await window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.REACT_APP_CLIENT_ID,
                scope: process.env.REACT_APP_SCOPES
            });

            const tokenResponse = await new Promise((resolve, reject) => {
                try {
                    client.callback = (resp) => {
                        if (resp.error !== undefined) {
                            reject(resp);
                        }

                        resolve(resp);
                    };
                    client.requestAccessToken({ prompt: "consent" });
                } catch (err) {
                    console.log(err);
                }
            });
            handleAuthResult(tokenResponse);
        };

        try {
            initialGoogleConnection();
        } catch (error) {
            console.log("error: ", error);
        }

        setLoading(false);
        // eslint-disable-next-line
    }, []);

    const handleAuthResult = (authResult) => {
        if (authResult && !authResult.error) {
            console.log("Sign-in successful");
            // setIsAuthorize(true);
            loadClient();
        } else {
            console.error("handleAuthResult...");
            console.error(authResult);
        }
        setLoading(false);
    };

    const handleAuthClick = () => {
        setLoading(true);
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: process.env.REACT_APP_CLIENT_ID,
            scope: process.env.REACT_APP_SCOPES,
            callback: (response) => {
                console.log(response);
            },
        });
        const token = client.requestAccessToken();
        handleAuthResult(token);
    };

    const loadClient = () => {
        return window.gapi.client.load("gmail", "v1").then(
            (res) => {
                console.log("gapi client loaded for API");
                setIsAuthorize(true);
                // getMessages();
            },
            (err) => {
                console.error("Error loading window.gapi client for API", err);
            }
        );
    };

    return ( <
        EmailState >
        <
        ThemeProvider >
        <
        CSSReset / > {
            isAuthorize ? ( <
                Main / >
            ) : ( <
                SignIn loading = { loading }
                handleAuthClick = { handleAuthClick }
                />
            )
        } <
        /ThemeProvider> <
        /EmailState>
    );
};

export default App;