from setuptools import setup, find_packages

setup(
    name="airshark",
    version="0.1.0",
    author="ParaDrop Lab",
    license="Apache 2",
    packages=find_packages(),
    install_requires=[
        'aiohttp',
        'cchardet',
        'aiodns',
        'ujson',
        'python-socketio'
    ],

    entry_points={
        'console_scripts': [
            'airshark = airshark.main:main'
        ]
    },

    include_package_data = True
)
