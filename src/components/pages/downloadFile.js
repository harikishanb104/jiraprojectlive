import React from 'react';



const DownloadFileButton = (users) => {
    console.log(users);
    const handleDownload = () => {

        const fileUrl = `${process.env.PUBLIC_URL}/uploadfile/usersampledata.xlsx`; // Path to the file in the public folder
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'User_sample.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };

    return (
        <button  className="samplefile-link" onClick={handleDownload}>
            Download smaple file
        </button>
    );
};

export default DownloadFileButton;
