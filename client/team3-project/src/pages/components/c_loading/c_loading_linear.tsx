/*
* c_loading_linear.tsx
* component loading linear
* @input -
* @output show loading linear
* @author Panuphong Khonsue
* @Create Date 2566-12-08
*/
import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
    components: {
        MuiLinearProgress: {
            styleOverrides: {
                bar: {
                    backgroundColor: '#0ee8f1', // Set the background color here
                },
            },
        },
    },
});
export default function LinearIndeterminate() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        </ThemeProvider>
    );
}