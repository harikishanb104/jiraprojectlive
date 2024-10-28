import React from 'react';

import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
//import './powerbi.css';
const PowerBiReport= () => {
    return(
        <div>
<section className="App">
        <h1>Constoso Sales Manager Power BI (Business Intelligence)</h1>
        <section id="bi-report"> 
            <PowerBIEmbed
                embedConfig = {{
                    type: 'report',   // Since we are reporting a BI report, set the type to report
                    id: 'ce4fc0a8-9a15-47fc-85ef-269ba3a159d0', // Add the report Id here
                   embedUrl: "https://app.powerbi.com/reportEmbed?reportId=ce4fc0a8-9a15-47fc-85ef-269ba3a159d0&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19",
                    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzUwNGQ2OWQtOWYxOS00MzdkLTlkYjAtZDZjMzQxYzQ3ZGJiLyIsImlhdCI6MTcxNjk3NDk4NiwibmJmIjoxNzE2OTc0OTg2LCJleHAiOjE3MTY5ODAxMDMsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84V0FBQUFhejFKMFoycU9ORi8vRFVGM1JWcmd1ZHB4SnBKRElsTHlsTzRrUGN2Vmc4QWFNcS9YQ09tQXEwU08yVXNqcHg0NWVnczFZc2RIQXcvY1BoVGhvQnFUZDJlblU2bWthNDJOUHpzNVc4YWFLaz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiMThmYmNhMTYtMjIyNC00NWY2LTg1YjAtZjdiZjJiMzliM2YzIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiI4MTY2MTI1Zi04ZmI0LTRmN2UtOTE2Ni0xMzk4NDRiYjI5MDEiLCJmYW1pbHlfbmFtZSI6IlQiLCJnaXZlbl9uYW1lIjoiTmF2ZWVuIiwiaXBhZGRyIjoiMTgzLjgyLjEyMC45NCIsIm5hbWUiOiJOYXZlZW4gVCIsIm9pZCI6IjY5ZjZiMDVlLTgyOWItNGIwNC1iY2NjLWY0YzIxYjJhNWVjZiIsInB1aWQiOiIxMDAzMjAwMDk0Nzg3N0Y3IiwicmgiOiIwLkFUNEFuZFlFZFJtZmZVT2RzTmJEUWNSOXV3a0FBQUFBQUFBQXdBQUFBQUFBQUFBLUFDRS4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBJdGVtLkV4ZWN1dGUuQWxsIEl0ZW0uUmVhZFdyaXRlLkFsbCBJdGVtLlJlc2hhcmUuQWxsIE9uZUxha2UuUmVhZC5BbGwgT25lTGFrZS5SZWFkV3JpdGUuQWxsIFBpcGVsaW5lLkRlcGxveSBQaXBlbGluZS5SZWFkLkFsbCBQaXBlbGluZS5SZWFkV3JpdGUuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFJlcHJ0LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWRXcml0ZS5BbGwgVGVuYW50LlJlYWQuQWxsIFRlbmFudC5SZWFkV3JpdGUuQWxsIFVzZXJTdGF0ZS5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5HaXRDb21taXQuQWxsIFdvcmtzcGFjZS5HaXRVcGRhdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlNrbGlBRXN2SWpvbTYwSDk5dVdOYnJiUVllYnEwbkNjOTVad1pfY3RybEEiLCJ0aWQiOiI3NTA0ZDY5ZC05ZjE5LTQzN2QtOWRiMC1kNmMzNDFjNDdkYmIiLCJ1bmlxdWVfbmFtZSI6Im5hdmVlbnRAa2Vuc2l1bS5jb20iLCJ1cG4iOiJuYXZlZW50QGtlbnNpdW0uY29tIiwidXRpIjoiQkRMTEFNNkI3a0tjYlA0cGVBQ3ZBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.Mqd-GFaxhgKLX8z3FrLHjcEh2iiItzpab8TlFnk0vK48dWpvN_EfrJSZiVzBhdiMbXlf7ivLHEIP6xksz3R2hJ_U7dPjeJoAXpsX32-zO2t_gFhsaVxmW9nPmTLzw-IWJEN_ZcNsvMKH2LPq2rvRlt8cLEnDMLw5_e2cmXlvZFkRWMMPFDP89hoeZPydqoQbvRinIRyO_w2KVDCijNUQrqxOntWvm-BBt-ZcneRnoO1AudJHFwGuTgjdyGUfPp6wFfSqaZEDPrnH032eZXnZpeQYBPoUoqlCYHUtgyy6DqdlM1XXBk5Qh2CwduymNiwiZCjmKEv42IFJqxQWhRloTA',
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
        <section id="bi-report"> 
            <PowerBIEmbed
                embedConfig = {{
                    type: 'report',   // Since we are reporting a BI report, set the type to report
                    id: '2c0c4863-cddb-4e28-89fa-bcdf55b76e80', // Add the report Id here
                   embedUrl: "https://app.powerbi.com/reportEmbed?reportId=2c0c4863-cddb-4e28-89fa-bcdf55b76e80&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19",
                   accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzUwNGQ2OWQtOWYxOS00MzdkLTlkYjAtZDZjMzQxYzQ3ZGJiLyIsImlhdCI6MTcxNjk3NDk4NiwibmJmIjoxNzE2OTc0OTg2LCJleHAiOjE3MTY5ODAxMDMsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84V0FBQUFhejFKMFoycU9ORi8vRFVGM1JWcmd1ZHB4SnBKRElsTHlsTzRrUGN2Vmc4QWFNcS9YQ09tQXEwU08yVXNqcHg0NWVnczFZc2RIQXcvY1BoVGhvQnFUZDJlblU2bWthNDJOUHpzNVc4YWFLaz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiMThmYmNhMTYtMjIyNC00NWY2LTg1YjAtZjdiZjJiMzliM2YzIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiI4MTY2MTI1Zi04ZmI0LTRmN2UtOTE2Ni0xMzk4NDRiYjI5MDEiLCJmYW1pbHlfbmFtZSI6IlQiLCJnaXZlbl9uYW1lIjoiTmF2ZWVuIiwiaXBhZGRyIjoiMTgzLjgyLjEyMC45NCIsIm5hbWUiOiJOYXZlZW4gVCIsIm9pZCI6IjY5ZjZiMDVlLTgyOWItNGIwNC1iY2NjLWY0YzIxYjJhNWVjZiIsInB1aWQiOiIxMDAzMjAwMDk0Nzg3N0Y3IiwicmgiOiIwLkFUNEFuZFlFZFJtZmZVT2RzTmJEUWNSOXV3a0FBQUFBQUFBQXdBQUFBQUFBQUFBLUFDRS4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBJdGVtLkV4ZWN1dGUuQWxsIEl0ZW0uUmVhZFdyaXRlLkFsbCBJdGVtLlJlc2hhcmUuQWxsIE9uZUxha2UuUmVhZC5BbGwgT25lTGFrZS5SZWFkV3JpdGUuQWxsIFBpcGVsaW5lLkRlcGxveSBQaXBlbGluZS5SZWFkLkFsbCBQaXBlbGluZS5SZWFkV3JpdGUuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFJlcHJ0LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWRXcml0ZS5BbGwgVGVuYW50LlJlYWQuQWxsIFRlbmFudC5SZWFkV3JpdGUuQWxsIFVzZXJTdGF0ZS5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5HaXRDb21taXQuQWxsIFdvcmtzcGFjZS5HaXRVcGRhdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlNrbGlBRXN2SWpvbTYwSDk5dVdOYnJiUVllYnEwbkNjOTVad1pfY3RybEEiLCJ0aWQiOiI3NTA0ZDY5ZC05ZjE5LTQzN2QtOWRiMC1kNmMzNDFjNDdkYmIiLCJ1bmlxdWVfbmFtZSI6Im5hdmVlbnRAa2Vuc2l1bS5jb20iLCJ1cG4iOiJuYXZlZW50QGtlbnNpdW0uY29tIiwidXRpIjoiQkRMTEFNNkI3a0tjYlA0cGVBQ3ZBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.Mqd-GFaxhgKLX8z3FrLHjcEh2iiItzpab8TlFnk0vK48dWpvN_EfrJSZiVzBhdiMbXlf7ivLHEIP6xksz3R2hJ_U7dPjeJoAXpsX32-zO2t_gFhsaVxmW9nPmTLzw-IWJEN_ZcNsvMKH2LPq2rvRlt8cLEnDMLw5_e2cmXlvZFkRWMMPFDP89hoeZPydqoQbvRinIRyO_w2KVDCijNUQrqxOntWvm-BBt-ZcneRnoO1AudJHFwGuTgjdyGUfPp6wFfSqaZEDPrnH032eZXnZpeQYBPoUoqlCYHUtgyy6DqdlM1XXBk5Qh2CwduymNiwiZCjmKEv42IFJqxQWhRloTs',
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
</section>
        </div>
    )
};
export default PowerBiReport;

