import '@/styles/globals.css'
import type { AppProps } from 'next/app'
// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css"; 

import { config } from "@fortawesome/fontawesome-svg-core";
import { SongsContextProvider } from '@/context/SongsContext';
import { InfoContextProvider } from '@/context/InfoContext';
import { UserContextProvider } from '@/context/UserContext';
// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false; 

export default function App({ Component, pageProps }: AppProps) {
    return (
        <UserContextProvider>
            <InfoContextProvider>
                <SongsContextProvider>
                    <Component {...pageProps} />
                </SongsContextProvider>
            </InfoContextProvider>
        </UserContextProvider>
    )
}
