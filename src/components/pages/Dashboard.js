import React, { useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import "./Dashboard.css";
//import { PowerBIReport } from "powerbi-client";

const DashboardPage = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 60000);
        //1 minute is equal to 60,000 milliseconds.
        // 120000 milliseconds = 2 minutes
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <section id="bi-report">
                <PowerBIEmbed
                    embedConfig = {{
                        type: 'report',   // Since we are reporting a BI report, set the type to report
                        id: 'cc68dc69-b479-4855-b716-6825bca2e936', // Add the report Id here
                        embedUrl: "https://app.powerbi.com/reportEmbed?reportId=cc68dc69-b479-4855-b716-6825bca2e936&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19",
                        accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1HTHFqOThWTkxvWGFGZnBKQ0JwZ0I0SmFLcyIsImtpZCI6Ik1HTHFqOThWTkxvWGFGZnBKQ0JwZ0I0SmFLcyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzUwNGQ2OWQtOWYxOS00MzdkLTlkYjAtZDZjMzQxYzQ3ZGJiLyIsImlhdCI6MTcyMDUyMTcyMCwibmJmIjoxNzIwNTIxNzIwLCJleHAiOjE3MjA1MjYyOTYsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WEFBQUFWa1VTTjdZOUN0M0V6WnVUWDNFc2xwUzRsT0tpV3BNeElVb09ZejQzYitmQldJOUV3bmVJek5sSVd3MkRmWWhoWlZtU3FYVGw2NGlYT1ZXMVcrRjJXTFFOb1dlK1hJWHpaNlJZOG0wNmcvdz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiMThmYmNhMTYtMjIyNC00NWY2LTg1YjAtZjdiZjJiMzliM2YzIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCIiwiZ2l2ZW5fbmFtZSI6IkhhcmkiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxODMuODIuMTIwLjk0IiwibmFtZSI6IkhhcmkgQiIsIm9pZCI6IjM4YWZkMzA1LWQ1ZjctNDEwYS1hNjhkLTJmMzYyNjc3ODlkOSIsInB1aWQiOiIxMDAzMjAwMjEyOEI2QjdDIiwicmgiOiIwLkFUNEFuZFlFZFJtZmZVT2RzTmJEUWNSOXV3a0FBQUFBQUFBQXdBQUFBQUFBQUFBLUFKSS4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBJdGVtLkV4ZWN1dGUuQWxsIEl0ZW0uUmVhZFdyaXRlLkFsbCBJdGVtLlJlc2hhcmUuQWxsIE9uZUxha2UuUmVhZC5BbGwgT25lTGFrZS5SZWFkV3JpdGUuQWxsIFBpcGVsaW5lLkRlcGxveSBQaXBlbGluZS5SZWFkLkFsbCBQaXBlbGluZS5SZWFkV3JpdGUuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFJlcHJ0LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWRXcml0ZS5BbGwgVGVuYW50LlJlYWQuQWxsIFRlbmFudC5SZWFkV3JpdGUuQWxsIFVzZXJTdGF0ZS5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5HaXRDb21taXQuQWxsIFdvcmtzcGFjZS5HaXRVcGRhdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6InhXUFJyS3JmUEJMMDZsSjNKWlktNG5VclhSaTYwam52SklJdFZoMXhFcFUiLCJ0aWQiOiI3NTA0ZDY5ZC05ZjE5LTQzN2QtOWRiMC1kNmMzNDFjNDdkYmIiLCJ1bmlxdWVfbmFtZSI6ImhhcmliQGtlbnNpdW0uY29tIiwidXBuIjoiaGFyaWJAa2Vuc2l1bS5jb20iLCJ1dGkiOiJnQ1NiSnE1cXFVLU1fd19xcEVYQUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiMSAxOCJ9.ZEwAx9qWQtZpC1tIIp8AXPtUVAT9SkP0Llt01KFeLetksEFprcpt4VfL877U9FSoD6zrQ_ktrR-z2aWnxDQWz2YRdWToCsCrteDG0J3VVYPh3BtcuFDYcEompmKMHX3-xyU2S_0YlkPwCAiCP6P65KBS7mgDXVyoPSX7iDmfsAME1fdTdA3qLPqR2LhB5OY5nXNa-5QGZKtZtbgsZGg2w0efUdP8vqj5DsQghnqXDJYItWhBjelrUPYRHuc7z-bnseG7zHT4Pu_yl6E8vqmscXr1H_XZpgwn02wNhxjTduBr5liXAh6s6THzyUclWDjIYdNiYtVnRmOEFbBN3ENpdA',
                        tokenType: models.TokenType.Aad, // Since we are using an Azure Active Directory access token, set the token type to Aad
                        settings: {
                            panes: {
                                filters: {
                                    expanded: false,
                                    visible: true
                                }
                            },
                            background: models.BackgroundType.Transparent,
                        }
                    }}

                    eventHandlers = {
                        new Map([
                            ['loaded', function () {console.log('Report loaded');}],
                            ['rendered', function () {console.log('Report rendered');}],
                            ['error', function (event) {console.log(event.detail);}],
                            ['visualClicked', () => console.log('visual clicked')],
                            ['pageChanged', (event) => console.log(event)],
                        ])
                    }

                    cssClassName = { "bi-embedded" }
                    getEmbeddedComponent = { (embeddedReport) => {
                        window.report = embeddedReport; // save report in window object
                    }}
                />

            </section>

        </div>
    );
};

export default DashboardPage;